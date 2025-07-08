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
    if ( !recipientId || !content) {
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

  //   async markMessagesAsRead(senderId: number, recipientId: number) {
  //     return this.prisma.message.updateMany({
  //       where: {
  //         senderId,
  //         recipientId,
  //         isRead: false,
  //       },
  //       data: {
  //         isRead: true,
  //       },
  //     });
  //   }

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
    const messages = await redis.lrange(`user:${userId}:unreadMessages:from:${senderId}`, 0, -1);
    return messages.map((msg) => JSON.parse(msg));
  }

  /**
   * Clears unread messages for a user.
   * This method deletes the cached unread messages in Redis and marks all unread messages as read in the database.
   */
  async clearUnreadMessages(userId: string, senderId: string) {
    const redis = this.redisService.getClient();
    await redis.del(`user:${userId}:unreadMessages:from:${senderId}`);

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

  
  async cacheUnreadMessages(senderId: number, recipientId: number, message: any) {
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
