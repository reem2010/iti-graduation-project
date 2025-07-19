import {
  Injectable,
  Inject,
  forwardRef,
  InternalServerErrorException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ZoomService } from 'src/zoom/zoom.service';
import { AppointmentStatus } from '@prisma/client';
import { WalletService } from 'src/wallet/wallet.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { NotificationFacade } from '../notification/notification.facade';

export interface paymentResult {
  success: boolean;
  appointmentId?: number;
  paymentUrl?: string;
  message?: string;
}

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private zoomService: ZoomService,
    private walletService: WalletService,
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService,
    private readonly notificationFacade: NotificationFacade,
  ) {}

  async createAppointmentWithPayment(
    data: {
      patientId: number;
      doctorId: number;
      startTime: Date;
      endTime: Date;
      price: number;
      platformFee: number;
      patientEmail: string;
      patientPhone: string;
    },
    role: string,
  ): Promise<any> {
    if (role === 'doctor') {
      throw new ForbiddenException(
        'Doctors are not allowed to create appointments.',
      );
    }
    await this.validateDoctorAvailabilityAndSlot(
      data.doctorId,
      new Date(data.startTime),
      new Date(data.endTime),
    );
    try {
      const totalAmount = data.price + data.platformFee;

      const hasEnoughBalance = await this.walletService.pay(
        totalAmount,
        data.patientId,
      );

      if (hasEnoughBalance) {
        const appointment = await this.createAppointment({
          patientId: data.patientId,
          doctorId: data.doctorId,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
          price: data.price,
          platformFee: data.platformFee,
        });
        await this.notificationFacade.notifyAppointmentBooked(data.patientId, data.doctorId, appointment.id, appointment.startTime, appointment.doctorProfile?.user?.firstName || 'Doctor');
        return {
          status: 'success',
          message: 'Appointment created successfully using wallet balance',
          data: {
            appointmentId: appointment.id,
            paymentMethod: 'wallet',
          },
        };
      } else {
        const pendingAppointment = await this.createPendingAppointment(data);
        const paymentUrl = await this.transactionService.bookSession(
          pendingAppointment.id,
          data.patientId,
          totalAmount,
          data.patientEmail,
          data.patientPhone,
        );

        return {
          status: 'payment_required',
          message: 'Payment required to complete the booking',
          data: {
            appointmentId: pendingAppointment.id,
            paymentUrl: paymentUrl,
            paymentMethod: 'paymob',
          },
        };
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new InternalServerErrorException('Failed to create appointment');
    }
  }

  private async validateDoctorAvailabilityAndSlot(
    doctorId: number,
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    const overlappingAppointment = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
        status: { not: 'canceled' },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (overlappingAppointment) {
      throw new ConflictException({
        message: 'This time slot is already booked.',
        code: 'SLOT_CONFLICT',
      });
    }

    const dayOfWeek = startTime.getDay();
    console.log(dayOfWeek);
    const allAvailabilities = await this.prisma.doctorAvailability.findMany({
      where: {
        doctorId,
        dayOfWeek,
        validFrom: { lte: startTime },
        OR: [{ validUntil: null }, { validUntil: { gte: startTime } }],
      },
    });
    console.log(allAvailabilities);
    const inputStartHour = startTime.getHours() + startTime.getMinutes() / 60;
    const inputEndHour = endTime.getHours() + endTime.getMinutes() / 60;

    const availability = allAvailabilities.find((slot) => {
      const slotStartHour =
        slot.startTime.getHours() + slot.startTime.getMinutes() / 60;
      const slotEndHour =
        slot.endTime.getHours() + slot.endTime.getMinutes() / 60;

      return slotStartHour <= inputStartHour && slotEndHour >= inputEndHour;
    });

    if (!availability) {
      throw new BadRequestException({
        message: 'This time is outside the doctor’s availability.',
        code: 'NOT_AVAILABLE',
      });
    }
  }

  private async createPendingAppointment(data: {
    patientId: number;
    doctorId: number;
    startTime: Date;
    endTime: Date;
    price: number;
    platformFee: number;
  }) {
    return this.prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        startTime: data.startTime,
        endTime: data.endTime,
        price: data.price,
        platformFee: data.platformFee,
        status: AppointmentStatus.pending,
      },
      include: {
        patient: {
          include: { user: true },
        },
        doctorProfile: {
          include: { user: true },
        },
      },
    });
  }

  async confirmAppointmentPayment(appointmentId: number): Promise<void> {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          patient: true,
          doctorProfile: { include: { user: true } },
        },
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      if (appointment.status === AppointmentStatus.pending) {
        const doctor = appointment.doctorProfile.user;
        const startTime = appointment.startTime;
        const endTime = appointment.endTime;
        const duration =
          (endTime.getTime() - startTime.getTime()) / (1000 * 60);

        const zoomMeeting = await this.zoomService.createMeeting(doctor.email, {
          topic: `Therapy Session - Dr. ${doctor.firstName} ${doctor.lastName}`,
          startTime: startTime.toISOString(),
          duration: duration,
        });

        await this.prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            status: AppointmentStatus.scheduled,
            meetingUrl: zoomMeeting.join_url,
            meetingId: zoomMeeting.id.toString(),
            meetingPassword: zoomMeeting.password,
          },
        });
      }
    } catch (error) {
      console.error('Error confirming appointment payment:', error);
      throw new Error('Failed to confirm appointment payment');
    }
  }

  // handle failed payment
  async handleFailedPayment(appointmentId: number): Promise<void> {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      if (appointment.status === AppointmentStatus.pending) {
        await this.prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            status: AppointmentStatus.canceled,
            cancelReason: 'Payment failed',
          },
        });
      }
    } catch (error) {
      console.error('Error handling failed payment:', error);
      throw new Error('Failed to handle failed payment');
    }
  }

  async createAppointment(data: {
    patientId: number;
    doctorId: number;
    startTime: Date;
    endTime: Date;
    price: number;
    platformFee: number;
  }) {
    try {
      const doctor = await this.prisma.user.findUnique({
        where: { id: data.doctorId },
        include: { doctorProfile: true },
      });

      const patient = await this.prisma.user.findUnique({
        where: { id: data.patientId },
        include: { patientProfile: true },
      });

      const duration =
        (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60); // duration in minutes
      const zoomMeeting = await this.zoomService.createMeeting(doctor.email, {
        topic: `Therapy Session - Dr. ${doctor.firstName} ${doctor.lastName}`,
        startTime: data.startTime.toISOString(),
        duration: duration,
      });

      const appointment = await this.prisma.appointment.create({
        data: {
          patientId: data.patientId,
          doctorId: data.doctorId,
          startTime: data.startTime,
          endTime: data.endTime,
          price: data.price,
          platformFee: data.platformFee,
          meetingUrl: zoomMeeting.join_url,
          meetingId: zoomMeeting.id.toString(),
          meetingPassword: zoomMeeting.password,
          status: 'scheduled',
        },
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          doctorProfile: {
            include: {
              user: true,
            },
          },
        },
      });
      return appointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('Failed to create appointment');
    }
  }

  //get all appointments for a user (doctor or patient)
  async getUserAppointments(userId: number, userRole: string) {
    const whereCondition =
      userRole === 'doctor' ? { doctorId: userId } : { patientId: userId };
    return this.prisma.appointment.findMany({
      where: whereCondition,
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        doctorProfile: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });
  }

  //get appointment by id
  async getAppointmentById(appointmentId: number) {
    return this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        doctorProfile: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async updateAppointment(
    appointmentId: number,
    data: { startTime?: Date; endTime?: Date; status?: string },
  ) {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          doctorProfile: {
            include: { user: true },
          },
        },
      });
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      if (data.startTime && data.endTime && appointment.meetingId) {
        const duration = Math.ceil(
          (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60),
        );

        await this.zoomService.updateMeeting(appointment.meetingId, {
          start_time: data.startTime.toISOString(),
          duration: duration,
        });
      }
      if (data.startTime && data.endTime) {
        await this.notificationFacade.notifyAppointmentRescheduled(appointment.patientId, appointment.doctorId, appointment.id, appointment.startTime, data.startTime, appointment.doctorProfile?.user?.firstName || 'Doctor');
      }
      return this.prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          ...(data.startTime && { startTime: data.startTime }),
          ...(data.endTime && { endTime: data.endTime }),
          ...(data.status && {
            status: { set: data.status as AppointmentStatus },
          }),
        },
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          doctorProfile: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw new Error('Failed to update appointment');
    }
  }
  async cancelAppointment(
    appointmentId: number,
    cancelReason: string,
    role: string,
  ) {
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          doctorProfile: {
            include: { user: true },
          },
        },
      });
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      if (appointment.status === 'scheduled') {
        await this.handleRefund(appointmentId, role);
      }

      if (appointment.meetingId) {
        await this.zoomService.deleteMeeting(appointment.meetingId);
      }
      await this.notificationFacade.notifyAppointmentCancelled(appointment.patientId, appointment.doctorId, appointment.id, appointment.startTime, appointment.doctorProfile?.user?.firstName || 'Doctor');
      return this.prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status: 'canceled',
          cancelReason: cancelReason,
          meetingUrl: null,
          meetingId: null,
          meetingPassword: null,
        },
        include: {
          patient: {
            include: {
              user: true,
            },
          },
          doctorProfile: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw new Error('Failed to cancel appointment');
    }
  }

  private async handleRefund(
    appointmentId: number,
    role: string,
  ): Promise<void> {
    //refund based on 24 hrs
    try {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }
      const totalAmount = appointment.price.plus(appointment.platformFee);
      const appointmentTime = appointment.startTime;
      const currentTime = new Date();
      const timeDifference = appointmentTime.getTime() - currentTime.getTime();
      const hoursUntilAppointment = timeDifference / (1000 * 60 * 60);

      if (hoursUntilAppointment < 24 || role == 'doctor') {
        // Process refund to bank
        await this.transactionService.refundToBank(appointmentId);
      } else {
        // refund to wallet
        await this.walletService.refund(
          totalAmount.toNumber(),
          appointment.patientId,
        );
      }
    } catch (error) {
      console.error('Error handling refund:', error);
      throw new Error('Failed to handle refund');
    }
  }

  //mark appointment as completed
  async completeAppointement(
    appointmentId: number,
    data: {
      diagnosis?: string;
      perscription?: string;
      followUp?: string;
      notes?: string;
    },
  ) {
    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...(data.diagnosis && { diagnosis: data.diagnosis }),
        ...(data.perscription && { perscription: data.perscription }),
        ...(data.followUp && { followUp: data.followUp }),
        ...(data.notes && { notes: data.notes }),
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        doctorProfile: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
