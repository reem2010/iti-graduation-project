import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from '../notification/notification.service';
import { MessagesService } from '../messages/messages.service';
import { MessageDto } from '../messages/dto/message.dto';
import { forwardRef, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({ cors: { origin: '*' } })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, number>();

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    @Inject(forwardRef(() => MessagesService))
    private messagesService: MessagesService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token || client.handshake.query.token;
    const userIdFromQuery = client.handshake.query.userId;
    let userId: number;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as any;
        userId = decoded.userId;
      } catch {
        client.disconnect();
        return;
      }
    } else if (userIdFromQuery) {
      userId = parseInt(userIdFromQuery as string);
    } else {
      client.disconnect();
      return;
    }
    
    if (!userId) {
      client.disconnect();
      return;
    }
    
    this.connectedUsers.set(client.id, userId);
    
    // Join messages room (same as old gateway)
    client.join(userId.toString());
    console.log(`User ${userId} connected with socket ID ${client.id}`);
    await this.messagesService.setUserOnline(userId.toString());
    
    // Join notifications room
    await client.join(`notifications_${userId}`);
    
    client.emit('connected', {
      userId,
      message: 'Connected to messages and notifications',
      rooms: [userId.toString(), `notifications_${userId}`],
      timestamp: new Date().toISOString(),
    });
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      console.log(`User ${userId} disconnected from messages and notifications`);
      await this.messagesService.setUserOffline(userId.toString());
      this.connectedUsers.delete(client.id);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    let payload: MessageDto;
    if (typeof data === 'string') {
      try {
        payload = JSON.parse(data);
      } catch (error) {
        throw new WsException('Invalid JSON format in message');
      }
    } else {
      payload = data;
    }

    // set senderId from client query
    const senderId = Number(client.handshake.query.userId);

    // Save message to database
    const savedMessage = await this.messagesService.create(payload, senderId);

    // Cache unread
    await this.messagesService.cacheUnreadMessages(senderId, payload.recipientId, savedMessage);

    // increment count of total unread messages in Redis variable
    await this.messagesService.incrementUnreadCount(payload.recipientId);

    // Emit to recipient
    this.server.to(payload.recipientId.toString()).emit('newMessage', savedMessage);

    // Emit confirmation to sender
    client.emit('messageSent', savedMessage);

    return savedMessage;
  }

  // Notification events
  @SubscribeMessage('createNotification')
  async handleCreateNotification(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) {
      client.emit('error', { message: 'User not authenticated', timestamp: new Date().toISOString() });
      return;
    }
    await this.sendNotificationToUser(data.userId, data);
    client.emit('notificationCreated', { ...data, timestamp: new Date().toISOString() });
  }

  async sendNotificationToUser(userId: number, notification: any) {
    const room = `notifications_${userId}`;
    this.server.to(room).emit('newNotification', { ...notification, timestamp: new Date().toISOString() });
  }

  async sendNotificationToUsers(userIds: number[], notification: any) {
    for (const userId of userIds) {
      await this.sendNotificationToUser(userId, notification);
    }
  }

  async broadcastNotification(notification: any) {
    this.server.emit('newNotification', { ...notification, timestamp: new Date().toISOString() });
  }

  async updateUnreadCount(userId: number, unreadCount: number) {
    const room = `notifications_${userId}`;
    this.server.to(room).emit('unreadCount', { unreadCount, timestamp: new Date().toISOString() });
  }

  // Send both message and notification to the same user
  async sendMessageAndNotification(
    userId: number, 
    message: any, 
    notification: any
  ) {
    try {
      // Send message to messages room (same as old gateway)
      this.server.to(userId.toString()).emit('newMessage', {
        ...message,
        timestamp: new Date().toISOString()
      });
      
      // Send notification to notifications room
      this.server.to(`notifications_${userId}`).emit('newNotification', {
        ...notification,
        timestamp: new Date().toISOString()
      });
      
      console.log(`Sent both message and notification to user ${userId}`);
      
      return {
        success: true,
        message: 'Both message and notification sent successfully',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error sending message and notification:', error);
      throw error;
    }
  }

  // Get connection information
  getConnectionInfo() {
    return {
      connectedUsers: this.connectedUsers.size,
      users: Array.from(this.connectedUsers.values()),
      timestamp: new Date().toISOString()
    };
  }
} 