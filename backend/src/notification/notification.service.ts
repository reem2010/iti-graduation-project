import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateNotificationDto,
  NotificationType,
  NotificationQueryDto,
} from './dto/notification.dto';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => RealtimeGateway))
    private realtimeGateway: RealtimeGateway,
  ) {}

  // Basic CRUD Operations
  async getUserNotifications(userId: number, query: NotificationQueryDto = {}) {
    const { skip = 0, take = 20, type, isRead } = query;

    // Build where clause
    const whereClause: any = { userId };
    if (type) whereClause.type = type;
    if (isRead !== undefined) whereClause.isRead = isRead;

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: Number(skip),
        take: Number(take),
      }),
      this.prisma.notification.count({
        where: whereClause,
      }),
      this.prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return {
      notifications,
      unreadCount,
      total,
      hasMore: skip + take < total,
    };
  }

  async markAsRead(userId: number, notificationId: number) {
    // Check if notification exists and belongs to user
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    // If already read, return without updating
    if (notification.isRead) {
      return notification;
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    // Update unread count via WebSocket
    const unreadCount = await this.getUnreadCount(userId);
    await this.realtimeGateway.updateUnreadCount(userId, unreadCount.unreadCount);

    return updatedNotification;
  }

  async markAllAsRead(userId: number) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    // Update unread count via WebSocket
    await this.realtimeGateway.updateUnreadCount(userId, 0);

    return {
      message: 'All notifications marked as read',
      updatedCount: result.count,
    };
  }

  async deleteNotification(userId: number, notificationId: number) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({ where: { id: notificationId } });
    return { message: 'Notification deleted successfully' };
  }

  async createNotification(data: CreateNotificationDto) {
    // Validate userId exists
    const userExists = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!userExists) {
      throw new BadRequestException('User not found');
    }

    const notification = await this.prisma.notification.create({ data });

    return notification;
  }

  async getUnreadCount(userId: number) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { unreadCount: count };
  }

  async clearAllNotifications(userId: number) {
    const result = await this.prisma.notification.deleteMany({
      where: { userId },
    });

    // Update unread count via WebSocket
    await this.realtimeGateway.updateUnreadCount(userId, 0);

    return {
      message: 'All notifications cleared',
      deletedCount: result.count,
    };
  }

  async getNotificationById(userId: number, notificationId: number) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async getNotificationsByType(
    userId: number,
    type: NotificationType,
    skip = 0,
    take = 20,
  ) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId, type },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    return notifications;
  }
}
