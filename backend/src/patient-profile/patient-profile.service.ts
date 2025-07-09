import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient-profile.dto';
import { UpdatePatientDto } from './dto/update-patient-profile.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async getPatientProfile(user: any) {
    const { userId /*,role*/ } = user;

    // if (role !== 'patient') {
    //   throw new ForbiddenException('Only patients can access their profile');
    // }

    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile does not exist');
    }

    // if (patient.userId !== userId) {
    //   throw new UnauthorizedException(
    //     'You are not authorized to access this profile',
    //   );
    // }

    return {
      message: 'Patient profile fetched successfully',
      data: patient,
    };
  }

  async getPatientProfileById(userId: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile does not exist');
    }

    return {
      message: 'Patient profile fetched successfully',
      data: patient,
    };
  }

  async createPatientProfile(user: any, dto: CreatePatientDto) {
    const { userId, role } = user;

    if (role !== 'patient') {
      throw new ForbiddenException('Only patients can create their profile');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new UnauthorizedException('User not found');
    }

    const existing = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('Patient profile already exists');
    }

    const newPatient = await this.prisma.patient.create({
      data: {
        userId,
        ...dto,
      },
    });

    return {
      message: 'Patient profile created successfully',
      data: newPatient,
    };
  }

  async updatePatientProfile(user: any, dto: UpdatePatientDto) {
    const { userId, role } = user;

    if (role !== 'patient') {
      throw new ForbiddenException('Only patients can update their profile');
    }

    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile does not exist');
    }

    if (patient.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this profile',
      );
    }

    const updatedPatient = await this.prisma.patient.update({
      where: { userId },
      data: {
        ...dto,
      },
    });

    return {
      message: 'Patient profile updated successfully',
      data: updatedPatient,
    };
  }

  async deletePatientProfile(user: any) {
    const { userId, role } = user;

    if (role !== 'patient') {
      throw new ForbiddenException('Only patients can delete their profile');
    }

    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new NotFoundException('Patient profile does not exist');
    }

    if (patient.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this profile',
      );
    }

    await this.prisma.patient.delete({
      where: { userId },
    });

    return {
      message: 'Patient profile deleted successfully',
    };
  }
}
