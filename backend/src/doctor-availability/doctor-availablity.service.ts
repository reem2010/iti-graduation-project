import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDoctorAvailabilityDto } from './dto/create-doctor-availability.dto';
import { UpdateDoctorAvailabilityDto } from './dto/update-doctor-availability.dto';

@Injectable()
export class DoctorAvailabilityService {
  constructor(private prisma: PrismaService) {}

  async getDoctorAvailabilities(user: any) {
    const { userId } = user;

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

  async createEmptyAvailability(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'doctor') {
      throw new ForbiddenException('Only doctors can have availability');
    }

    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new BadRequestException(
        'Doctor profile must exist before setting availability',
      );
    }

    const existing = await this.prisma.doctorAvailability.findFirst({
      where: { doctorId: userId },
    });

    if (existing) {
      return {
        message: 'Availability already exists',
      };
    }

    // Empty availability record (just to initialize if needed)
    await this.prisma.doctorAvailability.create({
      data: {
        doctorId: userId,
        dayOfWeek: 0,
        startTime: new Date(),
        endTime: new Date(),
        validFrom: new Date(),
        validUntil: null,
      },
    });

    return {
      message: 'Empty doctor availability created',
    };
  }

  async createDoctorAvailability(user: any, dto: CreateDoctorAvailabilityDto) {
    const { userId, role } = user;

    if (role !== 'doctor') {
      throw new ForbiddenException('Only doctors can create availability');
    }

    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!doctorProfile) {
      throw new BadRequestException('Doctor profile not found');
    }

    const newAvailability = await this.prisma.doctorAvailability.create({
      data: {
        doctorId: userId,
        dayOfWeek: dto.dayOfWeek,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        validFrom: new Date(dto.validFrom),
        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
        isRecurring: dto.isRecurring ?? false,
      },
    });

    return {
      message: 'Doctor availability created successfully',
      data: newAvailability,
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

  async getNext7DaysAvailableSlots(doctorId: number) {
    const now = new Date();

    const today = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    const endOfRange = new Date(today);
    endOfRange.setUTCDate(today.getUTCDate() + 7);

    const slots: { date: string; startTime: string; endTime: string }[] = [];

    const availabilities = await this.prisma.doctorAvailability.findMany({
      where: {
        doctorId,
        validFrom: { lte: endOfRange },
        OR: [{ validUntil: null }, { validUntil: { gte: today } }],
      },
    });

    if (!availabilities.length) return [];

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        startTime: { gte: today, lt: endOfRange },
        status: { notIn: ['canceled', 'no_show'] },
      },
    });

    const bookedTimes = appointments.map((a) => a.startTime.toISOString());

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setUTCDate(today.getUTCDate() + i);

      const dateStr = currentDate.toISOString().split('T')[0];
      const dayOfWeek = currentDate.getUTCDay(); // 0 (Sun) to 6 (Sat)

      const dayAvailabilities = availabilities.filter((av) => {
        const validFrom = new Date(av.validFrom);
        const validUntil = av.validUntil ? new Date(av.validUntil) : null;

        return (
          av.dayOfWeek === dayOfWeek &&
          currentDate >= validFrom &&
          (!validUntil || currentDate <= validUntil)
        );
      });

      for (const availability of dayAvailabilities) {
        const availabilityStart = new Date(availability.startTime);
        const availabilityEnd = new Date(availability.endTime);

        const startTime = new Date(
          Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate(),
            availabilityStart.getUTCHours(),
            availabilityStart.getUTCMinutes(),
          ),
        );

        const endTime = new Date(
          Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate(),
            availabilityEnd.getUTCHours(),
            availabilityEnd.getUTCMinutes(),
          ),
        );

        const isToday =
          currentDate.getUTCFullYear() === now.getUTCFullYear() &&
          currentDate.getUTCMonth() === now.getUTCMonth() &&
          currentDate.getUTCDate() === now.getUTCDate();

        if (isToday && startTime <= now) {
          continue;
        }

        if (!bookedTimes.includes(startTime.toISOString())) {
          slots.push({
            date: dateStr,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
          });
        }
      }
    }

    return slots;
  }
}
