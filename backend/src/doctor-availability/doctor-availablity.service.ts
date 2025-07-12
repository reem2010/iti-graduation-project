import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDoctorAvailabilityDto } from './dto/create-doctor-availability.dto';
import { UpdateDoctorAvailabilityDto } from './dto/update-doctor-availability.dto';
import { isBefore, addMinutes, addDays } from 'date-fns';

@Injectable()
export class DoctorAvailabilityService {
  constructor(private prisma: PrismaService) {}

  async getDoctorAvailabilities(user: any) {
    const { userId /*, role*/ } = user;

    // if (role !== 'doctor') {
    //   throw new ForbiddenException('Only doctors can view availability');
    // }

    const records = await this.prisma.doctorAvailability.findMany({
      where: { doctorId: userId },
    });

    if (!records.length) {
      throw new NotFoundException('No availability records found');
    }

    return {
      message: 'Doctor availability fetched successfully',
      data: records,
    };
  }

  async getAvailabilityByDoctorId(doctorId: number) {
    const slots = await this.prisma.doctorAvailability.findMany({
      where: { doctorId },
    });

    return {
      message: 'Doctor availability fetched successfully',
      data: slots,
    };
  }

  async createDoctorAvailability(user: any, dto: CreateDoctorAvailabilityDto) {
    const { userId, role } = user;

    if (role !== 'doctor') {
      throw new ForbiddenException('Only doctors can create availability');
    }

    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new BadRequestException(
        'Doctor profile must exist before setting availability',
      );
    }

    const exists = await this.prisma.doctorAvailability.findFirst({
      where: {
        doctorId: userId,
        dayOfWeek: dto.dayOfWeek,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
    });

    if (exists) {
      throw new BadRequestException('This availability already exists');
    }

    const created = await this.prisma.doctorAvailability.create({
      data: {
        doctorId: userId,
        ...dto,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        validFrom: new Date(dto.validFrom),
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
      },
    });

    return {
      message: 'Doctor availability created successfully',
      data: created,
    };
  }

  async updateDoctorAvailability(
    user: any,
    id: number,
    dto: UpdateDoctorAvailabilityDto,
  ) {
    const { userId, role } = user;

    if (role !== 'doctor') {
      throw new ForbiddenException('Only doctors can update availability');
    }

    const availability = await this.prisma.doctorAvailability.findFirst({
      where: { id, doctorId: userId },
    });

    if (!availability) {
      throw new NotFoundException('Availability record not found');
    }

    const updated = await this.prisma.doctorAvailability.update({
      where: { id },
      data: {
        ...dto,
        startTime: dto.startTime ? new Date(dto.startTime) : undefined,
        endTime: dto.endTime ? new Date(dto.endTime) : undefined,
        validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
      },
    });

    return {
      message: 'Doctor availability updated successfully',
      data: updated,
    };
  }

  async deleteDoctorAvailability(user: any, id: number) {
    const { userId, role } = user;

    if (role !== 'doctor') {
      throw new ForbiddenException('Only doctors can delete availability');
    }

    const availability = await this.prisma.doctorAvailability.findFirst({
      where: { id, doctorId: userId },
    });

    if (!availability) {
      throw new NotFoundException('Availability record not found');
    }

    await this.prisma.doctorAvailability.delete({
      where: { id },
    });

    return {
      message: 'Doctor availability deleted successfully',
    };
  }
  async getWeeklyAvailableSlots(doctorId: number) {
    const startDate = new Date(); // today
    const endDate = addDays(startDate, 7); // 7 days later
    const slots: { date: string; startTime: string; endTime: string }[] = [];

    const availabilities = await this.prisma.doctorAvailability.findMany({
      where: {
        doctorId,
        validFrom: { lte: endDate },
        OR: [{ validUntil: null }, { validUntil: { gte: startDate } }],
      },
    });

    if (!availabilities.length) return [];

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        startTime: {
          gte: startDate,
          lt: endDate,
        },
        status: { notIn: ['canceled', 'no_show'] },
      },
    });

    const bookedTimes = appointments.map((a) => a.startTime.toISOString());

    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i);
      const dayOfWeek = date.getDay();
      const todaysAvailabilities = availabilities.filter(
        (a) => a.dayOfWeek === dayOfWeek,
      );

      for (const availability of todaysAvailabilities) {
        const dateStr = date.toISOString().split('T')[0];
        let current = new Date(
          `${dateStr}T${availability.startTime.toISOString().split('T')[1]}`,
        );
        const end = new Date(
          `${dateStr}T${availability.endTime.toISOString().split('T')[1]}`,
        );

        while (isBefore(current, end)) {
          const next = addMinutes(current, 60);
          const slotTaken = bookedTimes.includes(current.toISOString());

          if (!slotTaken) {
            slots.push({
              date: dateStr,
              startTime: current.toISOString(),
              endTime: next.toISOString(),
            });
          }

          current = next;
        }
      }
    }

    return slots;
  }
}
