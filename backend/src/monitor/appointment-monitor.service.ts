import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';
import { AppointmentsService } from 'src/appointment/appointments.service';
import { AppointmentStatus, TransactionStatus } from '@prisma/client';
import { NotificationFacade } from '../notification/notification.facade';

@Injectable()
export class AppointmentMonitorService {
  private readonly logger = new Logger(AppointmentMonitorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly appointmentsService: AppointmentsService,
    private readonly notificationFacade: NotificationFacade,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAppointmentCheck() {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    // Find appointments that are still pending and older than 15 min
    const expiredAppointments = await this.prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.pending,
        createdAt: { lt: fifteenMinutesAgo },
      },
    });

    if (expiredAppointments.length === 0) {
      this.logger.log('No expired appointments found');
      return;
    }

    for (const appointment of expiredAppointments) {
      this.logger.log(`Cancelling expired appointment ${appointment.id}`);

      // Directly update appointment status to 'cancelled'
      await this.prisma.appointment.update({
        where: { id: appointment.id },
        data: {
          status: AppointmentStatus.canceled,
          cancelReason:
            'Automatically cancelled after 15 minutes of no payment',
        },
      });

      // Update related pending transaction to 'failed'
      await this.prisma.transaction.updateMany({
        where: {
          appointmentId: appointment.id,
          status: TransactionStatus.pending,
        },
        data: {
          status: TransactionStatus.failed,
          description: 'Automatically failed due to appointment expiration',
        },
      });
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async sendRemindersTwoDaysBefore() {
    const now = new Date();
    const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);

    // 2 days before
    const appointmentsInTwoDays = await this.prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.scheduled,
        startTime: {
          gte: new Date(twoDaysLater.getTime() - 60 * 1000), // 1 min window
          lt: new Date(twoDaysLater.getTime() + 60 * 1000),
        },
      },
      include: {
        patient: true,
        doctorProfile: { include: { user: true } },
      },
    });
    for (const appointment of appointmentsInTwoDays) {
      await this.notificationFacade.notifyAppointmentReminder(
        appointment.patientId,
        appointment.doctorId,
        appointment.id,
        appointment.startTime,
        appointment.doctorProfile?.user?.firstName || 'Doctor',
      );
    }

    // 5 minutes before
    const appointmentsInFiveMinutes = await this.prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.scheduled,
        startTime: {
          gte: new Date(fiveMinutesLater.getTime() - 60 * 1000),
          lt: new Date(fiveMinutesLater.getTime() + 60 * 1000),
        },
      },
      include: {
        patient: true,
        doctorProfile: { include: { user: true } },
      },
    });
    for (const appointment of appointmentsInFiveMinutes) {
      await this.notificationFacade.notifyAppointmentReminder(
        appointment.patientId,
        appointment.doctorId,
        appointment.id,
        appointment.startTime,
        appointment.doctorProfile?.user?.firstName || 'Doctor',
      );
    }
  }
}
