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

  async getDoctorAvailabilityById(user: any, id: number) {
    const { userId /*, role */ } = user;
    // if (role !== 'doctor') {
    //   throw new ForbiddenException('Only doctors can view availability by ID');
    // }
    const availability = await this.prisma.doctorAvailability.findUnique({
      where: { id, doctorId: userId },
    });
    if (!availability) {
      throw new NotFoundException('Availability record not found');
    }
    return {
      message: 'Doctor availability fetched successfully',
      data: availability,
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
}
