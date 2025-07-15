import { Injectable } from '@nestjs/common';
import { Prisma, AppointmentStatus, TransactionStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // --- DOCTORS LIST ---
  async getDoctors(params: {
    skip?: number;
    take?: number;
    isActive?: boolean;
    isVerified?: boolean;
  }) {
    const { skip = 0, take = 10, isActive, isVerified } = params;

    const where: Prisma.UserWhereInput = {
      role: 'doctor',
      ...(isActive !== undefined && { isActive }),
      ...(isVerified !== undefined && { isVerified }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { doctorProfile: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  // --- UPDATE DOCTOR STATUS ---
  async updateDoctorStatus(
    doctorId: number,
    update: { isVerified?: boolean; isActive?: boolean },
  ) {
    return this.prisma.user.update({
      where: { id: doctorId },
      data: update,
    });
  }

  // --- TRANSACTIONS WITH STATUS FILTER ---
  async getTransactions(params: {
    skip?: number;
    take?: number;
    status?: TransactionStatus;
  }) {
    const { skip = 0, take = 10, status } = params;

    const where: Prisma.TransactionWhereInput = {
      ...(status && { status }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { data, total };
  }

  // --- APPOINTMENTS WITH STATUS FILTER ---
  async getAppointments(params: {
    skip?: number;
    take?: number;
    status?: AppointmentStatus;
  }) {
    const { skip = 0, take = 10, status } = params;

    const where: Prisma.AppointmentWhereInput = {
      ...(status && { status }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          doctorProfile: {
            select: {
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
          patient: {
            select: {
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { data, total };
  }
}
