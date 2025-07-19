import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  //   UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateDoctorVerificationDto } from './dto/update-doctor-verification.dto';
import { NotificationFacade } from '../notification/notification.facade';

@Injectable()
export class DoctorVerificationService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationFacade: NotificationFacade,
  ) {}

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

  async getVerificationByDoctorId(doctorId: number) {
    const verification = await this.prisma.doctorVerification.findFirst({
      where: { userId: doctorId },
      include: { user: true },
    });

    if (!verification) {
      throw new NotFoundException('Doctor verification not found');
    }

    return verification;
  }

async createDefaultVerification(userId: number) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.role !== 'doctor') {
    throw new ForbiddenException('Only doctors can have a verification record');
  }

  const exists = await this.prisma.doctorVerification.findFirst({
    where: { userId },
  });

  if (exists) {
    throw new BadRequestException('Verification already exists');
  }

  const newVerification = await this.prisma.doctorVerification.create({
    data: {
      user: {
        connect: { id: userId },
      },
      licenseNumber: '',
      licensePhotoUrl: '',
      degree: '',
      university: '',
      graduationYear: 2000,
      specialization: '',
      idProofUrl: '',
      cvUrl: '',
      additionalCertificates: {}, // or `null` if allowed
    },
  });

  return {
    message: 'Default verification created successfully',
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
    await this.notificationFacade.notifyAccountStatusChanged(userId, 'pending');
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
    const verificationAfter = await this.prisma.doctorVerification.findFirst({ where: { id } });
    if (dto.status === 'approved') {
      await this.notificationFacade.notifyDoctorVerified(verificationAfter.userId);
    } else if (dto.status === 'rejected') {
      await this.notificationFacade.notifyDoctorVerificationRejected(verificationAfter.userId, dto.rejectionReason);
    } else {
      await this.notificationFacade.notifyAccountStatusChanged(verificationAfter.userId, dto.status);
    }
    return {
      message: 'Doctor verification reviewed successfully',
      data: updated,
    };
  }
}
