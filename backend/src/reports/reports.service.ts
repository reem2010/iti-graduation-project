// src/reports/reports.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async updateAppointmentReport(
    doctorId: number,
    appointmentId: number,
    dto: UpdateReportDto,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { doctorId: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.doctorId !== doctorId) {
      throw new ForbiddenException(
        'You are not authorized to update this appointment',
      );
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: dto,
    });
  }

  async getDoctorPatientsReports(doctorId: number) {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId },
      select: {
        diagnosis: true,
        prescription: true,
        notes: true,
        documents: true,
        patient: {
          select: {
            userId: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    const grouped = appointments.reduce((acc, appointment) => {
      if (!appointment.patient) return acc;

      const patientId = appointment.patient.userId;

      if (!acc[patientId]) {
        acc[patientId] = {
          patientId,
          patientName: `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`,
          reports: [],
        };
      }

      acc[patientId].reports.push({
        diagnosis: appointment.diagnosis,
        prescription: appointment.prescription,
        notes: appointment.notes,
        documents: appointment.documents,
      });

      return acc;
    }, {});

    return Object.values(grouped);
  }
}
