import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  //   UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDoctorVerificationDto } from './dto/create-doctor-verification.dto';
import { UpdateDoctorVerificationDto } from './dto/update-doctor-verification.dto';

@Injectable()
export class DoctorVerificationService {
  constructor(private prisma: PrismaService) {}

  async getDoctorVerification(user: any) {
    const { userId /*, role */ } = user;

    // if (role !== 'doctor') {
    //   throw new ForbiddenException('Only doctors can access verification data');
    // }

    const verification = await this.prisma.doctorVerification.findFirst({
      where: { userId },
    });

    if (!verification) {
      throw new NotFoundException('Doctor verification not found');
    }

    // if (verification.userId !== userId) {
    //   throw new UnauthorizedException(
    //     'You are not authorized to access this verification',
    //   );
    // }

    return {
      message: 'Doctor verification fetched successfully',
      data: verification,
    };
  }

  async createDoctorVerification(user: any, dto: CreateDoctorVerificationDto) {
    const { userId, role } = user;

    if (role !== 'doctor') {
      throw new ForbiddenException('Only doctors can create verification');
    }

    const existing = await this.prisma.doctorVerification.findFirst({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('Verification already exists');
    }

    const newVerification = await this.prisma.doctorVerification.create({
      data: {
        userId,
        ...dto,
      },
    });

    return {
      message: 'Doctor verification created successfully',
      data: newVerification,
    };
  }

  async updateDoctorVerification(user: any, dto: UpdateDoctorVerificationDto) {
    const { userId, role } = user;

    if (role !== 'doctor') {
      throw new ForbiddenException('Only doctors can update verification');
    }

    const verification = await this.prisma.doctorVerification.findFirst({
      where: { userId },
    });

    if (!verification) {
      throw new NotFoundException('Verification does not exist');
    }

    if (verification.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this verification',
      );
    }

    const updated = await this.prisma.doctorVerification.updateMany({
      where: { userId },
      data: { ...dto, status: 'pending' },
    });

    return {
      message: 'Doctor verification updated successfully',
      data: updated,
    };
  }

  async deleteDoctorVerification(user: any) {
    const { userId, role } = user;

    if (role !== 'doctor') {
      throw new ForbiddenException('Only doctors can delete verification');
    }

    const verification = await this.prisma.doctorVerification.findFirst({
      where: { userId },
    });

    if (!verification) {
      throw new NotFoundException('Verification does not exist');
    }

    await this.prisma.doctorVerification.deleteMany({
      where: { userId },
    });

    return {
      message: 'Doctor verification deleted successfully',
    };
  }

  async reviewDoctorVerification(id: number, admin: any, dto: any) {
    const { role, userId: adminId } = admin;
    console.log('Admin:', adminId);

    if (role !== 'admin') {
      throw new ForbiddenException(
        'Only admins can review verification requests',
      );
    }

    const verification = await this.prisma.doctorVerification.findFirst({
      where: { id },
    });

    if (!verification) {
      throw new NotFoundException('Verification not found');
    }
    if (role !== 'admin') {
      throw new ForbiddenException(
        'You are not authorized to review this verification',
      );
    }
    if (verification.status !== 'pending') {
      throw new BadRequestException('Verification is not pending');
    }
    if (dto.status == 'rejected') {
      if (!dto.rejectionReason) {
        throw new BadRequestException('Rejection reason is required');
      }
    }

    const updated = await this.prisma.doctorVerification.updateMany({
      where: { id },
      data: {
        status: dto.status,
        reviewedBy: adminId,
        rejectionReason: dto.rejectionReason,
        reviewedAt: new Date(),
      },
    });

    return {
      message: 'Doctor verification reviewed successfully',
      data: updated,
    };
  }
}
