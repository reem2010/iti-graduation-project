import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateNotificationDto,
  NotificationType,
  NotificationQueryDto,
} from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: number) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

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

    return this.prisma.notification.create({ data });
  }

  async createBulkNotifications(notifications: CreateNotificationDto[]) {
    if (!notifications || notifications.length === 0) {
      throw new BadRequestException('No notifications to create');
    }

    // Filter out invalid notifications
    const validNotifications = notifications.filter(
      (n) => n.userId && n.title && n.message,
    );

    if (validNotifications.length === 0) {
      throw new BadRequestException('No valid notifications provided');
    }

    return this.prisma.notification.createMany({
      data: validNotifications,
      skipDuplicates: true,
    });
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
    return this.getUserNotifications(userId, { type, skip, take });
  }

  // Domain-Specific Notification Methods
  async sendAppointmentConfirmation(
    patientId: number,
    doctorName: string,
    appointmentId: number,
    date: Date,
  ) {
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return this.createNotification({
      userId: patientId,
      title: 'Appointment Confirmed',
      message: `Your appointment with Dr. ${doctorName} on ${formattedDate} has been confirmed`,
      type: NotificationType.APPOINTMENT,
      referenceId: appointmentId,
    });
  }

  async sendAppointmentReminder(
    userId: number,
    doctorName: string,
    appointmentId: number,
    date: Date,
  ) {
    const timeString = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return this.createNotification({
      userId,
      title: 'Appointment Reminder',
      message: `You have an appointment with Dr. ${doctorName} tomorrow at ${timeString}`,
      type: NotificationType.REMINDER,
      referenceId: appointmentId,
    });
  }

  async sendPaymentReceipt(
    userId: number,
    amount: number,
    appointmentId: number,
  ) {
    return this.createNotification({
      userId,
      title: 'Payment Received',
      message: `Payment of $${amount.toFixed(2)} for appointment #${appointmentId} was successful`,
      type: NotificationType.PAYMENT,
      referenceId: appointmentId,
    });
  }

  async sendDoctorVerificationUpdate(
    doctorId: number,
    status: 'approved' | 'rejected' | 'pending',
    reason?: string,
  ) {
    const messages = {
      approved:
        'Your doctor verification has been approved! You can now start accepting appointments.',
      rejected: `Verification rejected: ${reason || 'Please check your documents and try again'}`,
      pending:
        'Your verification documents are under review. We will notify you once completed.',
    };

    const types = {
      approved: NotificationType.SUCCESS,
      rejected: NotificationType.ERROR,
      pending: NotificationType.INFO,
    };

    return this.createNotification({
      userId: doctorId,
      title: 'Verification Update',
      message: messages[status],
      type: types[status],
    });
  }

  async notifyNewArticleSubscribers(
    doctorId: number,
    articleId: number,
    subscriberIds: number[],
  ) {
    if (!subscriberIds || subscriberIds.length === 0) {
      return { message: 'No subscribers to notify' };
    }

    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: { firstName: true, lastName: true },
    });

    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }

    const notifications = subscriberIds.map((userId) => ({
      userId,
      title: 'New Article Published',
      message: `Dr. ${doctor.firstName} ${doctor.lastName} published a new article`,
      type: NotificationType.ARTICLE,
      referenceId: articleId,
    }));

    return this.createBulkNotifications(notifications);
  }

  async notifyDoctorAboutReview(
    doctorId: number,
    reviewId: number,
    rating: number,
  ) {
    const stars = '⭐'.repeat(Math.min(rating, 5));

    return this.createNotification({
      userId: doctorId,
      title: 'New Patient Review',
      message: `You received a new ${rating}-star review ${stars}`,
      type: NotificationType.REVIEW,
      referenceId: reviewId,
    });
  }

  async sendSystemAlert(
    userIds: number[],
    message: string,
    type: NotificationType = NotificationType.SYSTEM,
  ) {
    if (!userIds || userIds.length === 0) {
      throw new BadRequestException('No users specified');
    }

    const notifications = userIds.map((userId) => ({
      userId,
      title: 'System Notification',
      message,
      type,
    }));

    return this.createBulkNotifications(notifications);
  }

  async sendWelcomeNotification(userId: number) {
    return this.createNotification({
      userId,
      title: 'Welcome!',
      message: 'Welcome to our platform! We hope you have a great experience.',
      type: NotificationType.SUCCESS,
    });
  }

  async sendPasswordChangeNotification(userId: number) {
    return this.createNotification({
      userId,
      title: 'Password Changed',
      message:
        "Your password has been successfully changed. If this wasn't you, please contact support.",
      type: NotificationType.INFO,
    });
  }
}
