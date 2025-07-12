import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  ValidationPipe,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { NotificationService } from './notification.service';
import {
  CreateNotificationDto,
  NotificationQueryDto,
  NotificationType,
} from './dto/notification.dto';
import { PrismaService } from 'prisma/prisma.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async getUserNotifications(
    @Request() req,
    @Query(new ValidationPipe({ transform: true })) query: NotificationQueryDto,
  ) {
    return this.notificationService.getUserNotifications(
      req.user.userId,
      query,
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.notificationService.getUnreadCount(req.user.userId);
  }

  @Get(':id')
  async getNotificationById(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationService.getNotificationById(req.user.userId, id);
  }

  @Get('type/:type')
  async getNotificationsByType(
    @Request() req,
    @Param('type') type: NotificationType,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take = 20,
  ) {
    return this.notificationService.getNotificationsByType(
      req.user.userId,
      type,
      skip,
      take,
    );
  }

  @Put(':id/read')
  async markAsRead(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.notificationService.markAsRead(req.user.userId, id);
  }

  @Put('mark-all-read')
  async markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  async deleteNotification(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationService.deleteNotification(req.user.userId, id);
  }

  @Delete()
  async clearAllNotifications(@Request() req) {
    return this.notificationService.clearAllNotifications(req.user.userId);
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Add these endpoints to your notification.controller.ts for testing

  // Test endpoints - add these to NotificationController
  @Post('test-data')
  async createTestData(
    @Request() req,
    @Body() body: { userId?: number; count?: number },
  ) {
    const userId = body.userId || req.user.userId;
    const count = body.count || 10;

    const notifications = [];
    const types = Object.values(NotificationType);

    for (let i = 0; i < count; i++) {
      const randomType = types[Math.floor(Math.random() * types.length)];
      notifications.push({
        userId,
        title: `Test Notification ${i + 1}`,
        message: `This is test notification number ${i + 1}`,
        type: randomType,
        isRead: i % 3 === 0, // Some read, some unread
      });
    }

    await Promise.all(
      notifications.map((notification) =>
        this.notificationService.createNotification(notification),
      ),
    );

    return { message: `Created ${count} test notifications` };
  }

  @Post('test/appointment-confirmation')
  async testAppointmentConfirmation(
    @Body()
    body: {
      patientId: number;
      doctorName: string;
      appointmentId: number;
      date: string;
    },
  ) {
    return this.notificationService.sendAppointmentConfirmation(
      body.patientId,
      body.doctorName,
      body.appointmentId,
      new Date(body.date),
    );
  }

  @Post('test/appointment-reminder')
  async testAppointmentReminder(
    @Body()
    body: {
      userId: number;
      doctorName: string;
      appointmentId: number;
      date: string;
    },
  ) {
    return this.notificationService.sendAppointmentReminder(
      body.userId,
      body.doctorName,
      body.appointmentId,
      new Date(body.date),
    );
  }

  @Post('test/payment-receipt')
  async testPaymentReceipt(
    @Body() body: { userId: number; amount: number; appointmentId: number },
  ) {
    return this.notificationService.sendPaymentReceipt(
      body.userId,
      body.amount,
      body.appointmentId,
    );
  }

  @Post('test/verification-update')
  async testVerificationUpdate(
    @Body()
    body: {
      doctorId: number;
      status: 'approved' | 'rejected' | 'pending';
      reason?: string;
    },
  ) {
    return this.notificationService.sendDoctorVerificationUpdate(
      body.doctorId,
      body.status,
      body.reason,
    );
  }

  @Post('test/article-subscribers')
  async testArticleSubscribers(
    @Body()
    body: {
      doctorId: number;
      articleId: number;
      subscriberIds: number[];
    },
  ) {
    return this.notificationService.notifyNewArticleSubscribers(
      body.doctorId,
      body.articleId,
      body.subscriberIds,
    );
  }

  @Post('test/doctor-review')
  async testDoctorReview(
    @Body() body: { doctorId: number; reviewId: number; rating: number },
  ) {
    return this.notificationService.notifyDoctorAboutReview(
      body.doctorId,
      body.reviewId,
      body.rating,
    );
  }

  @Post('test/system-alert')
  async testSystemAlert(
    @Body()
    body: {
      userIds: number[];
      message: string;
      type?: NotificationType;
    },
  ) {
    return this.notificationService.sendSystemAlert(
      body.userIds,
      body.message,
      body.type,
    );
  }

  @Post('test/welcome')
  async testWelcome(@Body() body: { userId: number }) {
    return this.notificationService.sendWelcomeNotification(body.userId);
  }

  @Post('test/password-change')
  async testPasswordChange(@Body() body: { userId: number }) {
    return this.notificationService.sendPasswordChangeNotification(body.userId);
  }

  @Post('test/bulk-create')
  async testBulkCreate(
    @Body() body: { notifications: CreateNotificationDto[] },
  ) {
    return this.notificationService.createBulkNotifications(body.notifications);
  }

  @Post('test/reset')
  async resetTestData(@Request() req) {
    // Clear all notifications for testing user
    await this.notificationService.clearAllNotifications(req.user.userId);

    // Create fresh test data
    const notifications = [
      {
        userId: req.user.userId,
        title: 'Welcome Back',
        message: 'Test data has been reset',
        type: NotificationType.SUCCESS,
      },
      {
        userId: req.user.userId,
        title: 'Test Appointment',
        message: 'You have a test appointment tomorrow',
        type: NotificationType.APPOINTMENT,
      },
      {
        userId: req.user.userId,
        title: 'Test Payment',
        message: 'Test payment received',
        type: NotificationType.PAYMENT,
      },
    ];

    await Promise.all(
      notifications.map((notification) =>
        this.notificationService.createNotification(notification),
      ),
    );

    return { message: 'Test data reset successfully' };
  }

  @Get('test/stats')
  async getTestStats(@Request() req) {
    const userId = req.user.userId;

    const [total, unread, byType] = await Promise.all([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
      this.prisma.notification.groupBy({
        by: ['type'],
        where: { userId },
        _count: true,
      }),
    ]);

    return {
      total,
      unread,
      read: total - unread,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {}),
    };
  }
}
