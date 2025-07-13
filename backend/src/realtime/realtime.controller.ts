import { Controller, Get, Post, Body, UseGuards, Request, forwardRef, Inject } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { NotificationService } from '../notification/notification.service';
import { NotificationFacade } from '../notification/notification.facade';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('realtime')
export class RealtimeController {
  constructor(
    @Inject(forwardRef(() => RealtimeGateway))
    private realtimeGateway: RealtimeGateway,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    @Inject(forwardRef(() => NotificationFacade))
    private notificationFacade: NotificationFacade,
  ) {}

  @Get('connection-info')
  getConnectionInfo() {
    return {
      message: 'Realtime WebSocket server is running',
      timestamp: new Date().toISOString(),
      endpoints: {
        websocket: '/socket.io/',
        notifications: '/notifications',
      }
    };
  }

  // ========================================
  // TEMPORARY TEST ENDPOINTS FOR NOTIFICATION FACADE
  // ========================================

  @Post('test/appointment-booked')
  @UseGuards(JwtAuthGuard)
  async testAppointmentBooked(
    @Request() req,
    @Body() body: { patientId: number; doctorId: number; appointmentId: number; date: string; doctorName: string }
  ) {
    const notification = await this.notificationFacade.notifyAppointmentBooked(
      body.patientId,
      body.doctorId,
      body.appointmentId,
      new Date(body.date),
      body.doctorName
    );

    return {
      success: true,
      notification,
      message: 'Appointment booked notification sent',
      timestamp: new Date().toISOString()
    };
  }

  @Post('test/payment-success')
  @UseGuards(JwtAuthGuard)
  async testPaymentSuccess(
    @Request() req,
    @Body() body: { userId: number; amount: number; appointmentId: number }
  ) {
    const notification = await this.notificationFacade.notifyPaymentSuccess(
      body.userId,
      body.amount,
      body.appointmentId
    );

    return {
      success: true,
      notification,
      message: 'Payment success notification sent',
      timestamp: new Date().toISOString()
    };
  }

  @Post('test/doctor-verified')
  @UseGuards(JwtAuthGuard)
  async testDoctorVerified(
    @Request() req,
    @Body() body: { doctorId: number }
  ) {
    const notification = await this.notificationFacade.notifyDoctorVerified(body.doctorId);

    return {
      success: true,
      notification,
      message: 'Doctor verification notification sent',
      timestamp: new Date().toISOString()
    };
  }

  @Post('test/new-review')
  @UseGuards(JwtAuthGuard)
  async testNewReview(
    @Request() req,
    @Body() body: { doctorId: number; reviewId: number; rating: number }
  ) {
    const notification = await this.notificationFacade.notifyDoctorReview(
      body.doctorId,
      body.reviewId,
      body.rating
    );

    return {
      success: true,
      notification,
      message: 'New review notification sent',
      timestamp: new Date().toISOString()
    };
  }

  @Post('test/welcome')
  @UseGuards(JwtAuthGuard)
  async testWelcome(
    @Request() req,
    @Body() body: { userId: number }
  ) {
    const notification = await this.notificationFacade.notifyWelcome(body.userId);

    return {
      success: true,
      notification,
      message: 'Welcome notification sent',
      timestamp: new Date().toISOString()
    };
  }

  @Post('test/system-alert')
  @UseGuards(JwtAuthGuard)
  async testSystemAlert(
    @Request() req,
    @Body() body: { userIds: number[]; message: string; type?: string }
  ) {
    const notifications = await this.notificationFacade.notifySystemAlert(
      body.userIds,
      body.message,
      body.type as any
    );

    return {
      success: true,
      notifications,
      message: 'System alert notifications sent',
      timestamp: new Date().toISOString()
    };
  }

  @Post('test/appointment-cancelled')
  @UseGuards(JwtAuthGuard)
  async testAppointmentCancelled(
    @Request() req,
    @Body() body: { patientId: number; doctorId: number; appointmentId: number; date: string; doctorName: string }
  ) {
    const notification = await this.notificationFacade.notifyAppointmentCancelled(
      body.patientId,
      body.doctorId,
      body.appointmentId,
      new Date(body.date),
      body.doctorName
    );

    return {
      success: true,
      notification,
      message: 'Appointment cancelled notification sent',
      timestamp: new Date().toISOString()
    };
  }

  @Post('test/new-message')
  @UseGuards(JwtAuthGuard)
  async testNewMessage(
    @Request() req,
    @Body() body: { recipientId: number; senderName: string; messageId: number }
  ) {
    const notification = await this.notificationFacade.notifyNewMessage(
      body.recipientId,
      body.senderName,
      body.messageId
    );

    return {
      success: true,
      notification,
      message: 'New message notification sent',
      timestamp: new Date().toISOString()
    };
  }
} 