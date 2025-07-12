import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { NotificationType } from './dto/notification.dto';

@Injectable()
export class NotificationFacade {
  constructor(
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    @Inject(forwardRef(() => RealtimeGateway))
    private realtimeGateway: RealtimeGateway,
  ) {}

  // Helper method to send notification and update unread count
  private async sendNotificationAndUpdateCount(userId: number, notification: any) {
    await this.realtimeGateway.sendNotificationToUser(userId, notification);
    const unreadCount = await this.notificationService.getUnreadCount(userId);
    await this.realtimeGateway.updateUnreadCount(userId, unreadCount.unreadCount);
  }

  // ========================================
  // APPOINTMENT NOTIFICATIONS
  // ========================================

  // Notify patient about appointment booking
  async notifyAppointmentBooked(patientId: number, doctorId: number, appointmentId: number, date: Date, doctorName: string) {
    const notification = await this.notificationService.createNotification({
      userId: patientId,
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${doctorName} is booked for ${date.toLocaleString()}.`,
      type: NotificationType.APPOINTMENT,
      referenceId: appointmentId,
    });

    await this.sendNotificationAndUpdateCount(patientId, notification);
    return notification;
  }

  // Notify patient about appointment cancellation
  async notifyAppointmentCancelled(patientId: number, doctorId: number, appointmentId: number, date: Date, doctorName: string) {
    const notification = await this.notificationService.createNotification({
      userId: patientId,
      title: 'Appointment Cancelled',
      message: `Your appointment with Dr. ${doctorName} on ${date.toLocaleDateString()} has been cancelled.`,
      type: NotificationType.APPOINTMENT,
      referenceId: appointmentId,
    });

    await this.sendNotificationAndUpdateCount(patientId, notification);
    return notification;
  }

  // Notify patient about appointment rescheduled
  async notifyAppointmentRescheduled(patientId: number, doctorId: number, appointmentId: number, oldDate: Date, newDate: Date, doctorName: string) {
    const notification = await this.notificationService.createNotification({
      userId: patientId,
      title: 'Appointment Rescheduled',
      message: `Your appointment with Dr. ${doctorName} has been rescheduled from ${oldDate.toLocaleDateString()} to ${newDate.toLocaleDateString()}.`,
      type: NotificationType.APPOINTMENT,
      referenceId: appointmentId,
    });

    await this.sendNotificationAndUpdateCount(patientId, notification);
    return notification;
  }

  // Notify patient about appointment reminder
  async notifyAppointmentReminder(patientId: number, doctorId: number, appointmentId: number, date: Date, doctorName: string) {
    const notification = await this.notificationService.createNotification({
      userId: patientId,
      title: 'Appointment Reminder',
      message: `You have an appointment with Dr. ${doctorName} tomorrow at ${date.toLocaleTimeString()}.`,
      type: NotificationType.REMINDER,
      referenceId: appointmentId,
    });

    await this.sendNotificationAndUpdateCount(patientId, notification);
    return notification;
  }

  // ========================================
  // PAYMENT NOTIFICATIONS
  // ========================================

  // Notify patient about payment success
  async notifyPaymentSuccess(userId: number, amount: number, appointmentId: number) {
    const notification = await this.notificationService.createNotification({
      userId,
      title: 'Payment Successful',
      message: `Payment of $${amount} for your appointment has been processed successfully.`,
      type: NotificationType.PAYMENT,
      referenceId: appointmentId,
    });

    await this.sendNotificationAndUpdateCount(userId, notification);
    return notification;
  }

  // Notify patient about payment failure
  async notifyPaymentFailed(userId: number, amount: number, appointmentId: number, reason?: string) {
    const notification = await this.notificationService.createNotification({
      userId,
      title: 'Payment Failed',
      message: `Payment of $${amount} failed${reason ? `: ${reason}` : ''}. Please try again.`,
      type: NotificationType.ERROR,
      referenceId: appointmentId,
    });

    await this.sendNotificationAndUpdateCount(userId, notification);
    return notification;
  }

  // ========================================
  // DOCTOR VERIFICATION NOTIFICATIONS
  // ========================================

  // Notify doctor about verification approval
  async notifyDoctorVerified(doctorId: number) {
    const notification = await this.notificationService.createNotification({
      userId: doctorId,
      title: 'Account Verified',
      message: 'Your doctor verification has been approved! You can now start accepting appointments.',
      type: NotificationType.SUCCESS,
    });

    await this.sendNotificationAndUpdateCount(doctorId, notification);
    return notification;
  }

  // Notify doctor about verification rejection
  async notifyDoctorVerificationRejected(doctorId: number, reason: string) {
    const notification = await this.notificationService.createNotification({
      userId: doctorId,
      title: 'Verification Rejected',
      message: `Your verification was rejected: ${reason}. Please update your information and try again.`,
      type: NotificationType.ERROR,
    });

    await this.sendNotificationAndUpdateCount(doctorId, notification);
    return notification;
  }

  // ========================================
  // REVIEW NOTIFICATIONS
  // ========================================

  // Notify doctor about new review
  async notifyDoctorReview(doctorId: number, reviewId: number, rating: number) {
    const stars = '⭐'.repeat(rating);
    const notification = await this.notificationService.createNotification({
      userId: doctorId,
      title: 'New Review Received',
      message: `You received a new ${rating}-star review ${stars}`,
      type: NotificationType.REVIEW,
      referenceId: reviewId,
    });

    await this.sendNotificationAndUpdateCount(doctorId, notification);
    return notification;
  }

  // ========================================
  // MESSAGE NOTIFICATIONS
  // ========================================

  // Notify user about new message
  async notifyNewMessage(recipientId: number, senderName: string, messageId: number) {
    const notification = await this.notificationService.createNotification({
      userId: recipientId,
      title: 'New Message',
      message: `You have a new message from ${senderName}`,
      type: NotificationType.MESSAGE,
      referenceId: messageId,
    });

    await this.sendNotificationAndUpdateCount(recipientId, notification);
    return notification;
  }

  // ========================================
  // ARTICLE NOTIFICATIONS
  // ========================================

  // Notify subscribers about new article
  async notifyNewArticle(doctorId: number, articleId: number, subscriberIds: number[], doctorName: string) {
    const notifications = [];
    for (const subscriberId of subscriberIds) {
      const notification = await this.notificationService.createNotification({
        userId: subscriberId,
        title: 'New Article Available',
        message: `Dr. ${doctorName} has published a new article`,
        type: NotificationType.ARTICLE,
        referenceId: articleId,
      });

      await this.sendNotificationAndUpdateCount(subscriberId, notification);
      notifications.push(notification);
    }
    return notifications;
  }

  // ========================================
  // SYSTEM NOTIFICATIONS
  // ========================================

  // Notify user about welcome
  async notifyWelcome(userId: number) {
    const notification = await this.notificationService.createNotification({
      userId,
      title: 'Welcome!',
      message: 'Welcome to our platform! We hope you have a great experience.',
      type: NotificationType.SUCCESS,
    });

    await this.sendNotificationAndUpdateCount(userId, notification);
    return notification;
  }

  // Notify user about password change
  async notifyPasswordChanged(userId: number) {
    const notification = await this.notificationService.createNotification({
      userId,
      title: 'Password Changed',
      message: 'Your password has been successfully changed. If this wasn\'t you, please contact support.',
      type: NotificationType.INFO,
    });

    await this.sendNotificationAndUpdateCount(userId, notification);
    return notification;
  }

  // Send system alert to multiple users
  async notifySystemAlert(userIds: number[], message: string, type: NotificationType = NotificationType.SYSTEM) {
    const notifications = [];
    for (const userId of userIds) {
      const notification = await this.notificationService.createNotification({
        userId,
        title: 'System Alert',
        message,
        type,
      });

      await this.sendNotificationAndUpdateCount(userId, notification);
      notifications.push(notification);
    }
    return notifications;
  }

  // ========================================
  // INFO NOTIFICATIONS
  // ========================================

  // Notify user about profile update
  async notifyProfileUpdated(userId: number) {
    const notification = await this.notificationService.createNotification({
      userId,
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated.',
      type: NotificationType.INFO,
    });

    await this.sendNotificationAndUpdateCount(userId, notification);
    return notification;
  }

  // Notify user about account status change
  async notifyAccountStatusChanged(userId: number, status: string) {
    const notification = await this.notificationService.createNotification({
      userId,
      title: 'Account Status Changed',
      message: `Your account status has been changed to: ${status}`,
      type: NotificationType.INFO,
    });

    await this.sendNotificationAndUpdateCount(userId, notification);
    return notification;
  }

  // ========================================
  // WARNING NOTIFICATIONS
  // ========================================

  // Notify user about account suspension
  async notifyAccountSuspended(userId: number, reason: string) {
    const notification = await this.notificationService.createNotification({
      userId,
      title: 'Account Suspended',
      message: `Your account has been suspended: ${reason}. Please contact support for assistance.`,
      type: NotificationType.WARNING,
    });

    await this.sendNotificationAndUpdateCount(userId, notification);
    return notification;
  }

  // Notify user about security alert
  async notifySecurityAlert(userId: number, message: string) {
    const notification = await this.notificationService.createNotification({
      userId,
      title: 'Security Alert',
      message,
      type: NotificationType.WARNING,
    });

    await this.sendNotificationAndUpdateCount(userId, notification);
    return notification;
  }
} 