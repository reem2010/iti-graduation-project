import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MessageDto } from './dto/message.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async create(dto: MessageDto, userId: number) {
    const { recipientId, content } = dto;

    console.log('Payload received from client:', dto);

    // Validate required fields
    if (!recipientId || !content) {
      throw new BadRequestException('Missing required fields in message');
    }

    return this.prisma.message.create({
      data: {
        senderId: userId,
        recipientId,
        content,
      },
      include: {
        sender: true,
        recipient: true,
      },
    });
  }

  // Get chat list for a user
  async getChatList(userId: number) {
    // Get all distinct users this user has exchanged messages with
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      select: {
        senderId: true,
        recipientId: true,
        content: true,
        createdAt: true,
        isRead: true,
      },
    });

    // Track unique conversation users
    const chatMap = new Map<
      number,
      {
        userId: number;
        lastMessage: { content: string; createdAt: Date };
        unreadCount: number;
      }
    >();

    for (const msg of messages) {
      const isSender = msg.senderId === userId;
      const otherUserId = isSender ? msg.recipientId : msg.senderId;

      const isUnread = !msg.isRead && msg.recipientId === userId;

      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, {
          userId: otherUserId,
          lastMessage: { content: msg.content, createdAt: msg.createdAt },
          unreadCount: isUnread ? 1 : 0,
        });
      } else {
        const entry = chatMap.get(otherUserId)!;
        if (msg.createdAt > entry.lastMessage.createdAt) {
          entry.lastMessage = {
            content: msg.content,
            createdAt: msg.createdAt,
          };
        }
        if (isUnread) {
          entry.unreadCount += 1;
        }
      }
    }

    // Get usernames
    const userIds = Array.from(chatMap.keys());
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, firstName: true, lastName: true },
    });

    const userMap = new Map(
      users.map((u) => [u.id, [u.firstName, u.lastName].join(' ')]),
    );

    // Format response
    return Array.from(chatMap.values()).map((chat) => ({
      userId: chat.userId,
      username: userMap.get(chat.userId) || 'Unknown',
      unreadCount: chat.unreadCount,
      lastMessage: chat.lastMessage,
    }));
  }

  // Get conversation between two users
  async getConversation(senderId: number, recipientId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: senderId,
            recipientId: recipientId,
          },
          {
            senderId: recipientId,
            recipientId: senderId,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: true,
        recipient: true,
      },
    });
  }

  /**
   * Retrieves the online status of a user.
   * This method checks Redis for the user's online status and returns it as an object.
   */
  async getUserStatus(userId: string) {
    const redis = this.redisService.getClient();
    const isOnline = await redis.get(`user:${userId}:online`);
    return { userId, online: !!isOnline };
  }

  /**
   * Retrieves unread messages for a user.
   * This method fetches cached unread messages from Redis and returns them as an array of objects.
   */
  async getUnreadMessages(userId: string, senderId: string) {
    const redis = this.redisService.getClient();
    const messages = await redis.lrange(
      `user:${userId}:unreadMessages:from:${senderId}`,
      0,
      -1,
    );

    return messages.map((msg) => JSON.parse(msg));
  }

  /**
   * Increments the unread message count for a user.
   * This method updates the Redis key that tracks the total unread messages for a user.
   */
  async incrementUnreadCount(userId: number) {
    const redis = this.redisService.getClient();
    await redis.incr(`user:${userId}:unreadCount`);

    return { success: true };
  }

  /**
   * Retrieves the total unread message count for a user.
   * This method fetches the count from Redis and returns it.
   */
  async getUnreadCount(userId: number) {
    const redis = this.redisService.getClient();
    const count = await redis.get(`user:${userId}:unreadCount`);
    return { unreadCount: count };
  }

  /**
   * Clears unread messages for a user.
   * This method deletes the cached unread messages in Redis and marks all unread messages as read in the database.
   */
  async clearUnreadMessages(userId: string, senderId: string) {
    const redis = this.redisService.getClient();
    // await redis.del(`user:${userId}:unreadMessages:from:${senderId}`);

    const listKey = `user:${userId}:unreadMessages:from:${senderId}`;
    const totalCountKey = `user:${userId}:unreadCount`;

    // Get how many unread messages this sender has in Redis
    const unreadCountFromSender = await redis.llen(listKey);

    // Remove the list of unread messages from this sender
    await redis.del(listKey);

    // Decrease the total unread count by that number
    if (unreadCountFromSender > 0) {
      await redis.decrby(totalCountKey, unreadCountFromSender);
    }

    // mark all messages as read in the database
    await this.prisma.message.updateMany({
      where: {
        senderId: parseInt(senderId),
        recipientId: parseInt(userId),
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
    return { success: true };
  }

  async cacheUnreadMessages(
    senderId: number,
    recipientId: number,
    message: any,
  ) {
    const redis = this.redisService.getClient();
    // const isOnline = await redis.get(`user:${recipientId}:online`);

    // if (!isOnline) {
    const key = `user:${recipientId}:unreadMessages:from:${senderId}`;
    await redis.rpush(key, JSON.stringify(message));
    // }

    // return isOnline; // useful if caller wants to check
  }

  /**
   * Sets the user as online in Redis with a TTL of 5 minutes.
   * This method should be called when the user connects.
   */
  async setUserOnline(userId: string) {
    const redis = this.redisService.getClient();
    await redis.set(`user:${userId}:online`, 'true');
    await redis.expire(`user:${userId}:online`, 60 * 5);
  }

  /**
   * Sets the user as offline in Redis by deleting the online key.
   * This method should be called when the user disconnects.
   */
  async setUserOffline(userId: string) {
    const redis = this.redisService.getClient();
    await redis.del(`user:${userId}:online`);
  }
}
