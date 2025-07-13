import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DoctorProfileService {
  constructor(private prisma: PrismaService) {}

  //   anyone can access doctor profile, but only doctors can create or update their own profiles
  async getDoctorProfile(user: any) {
    const { userId } = user;

    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    return {
      message: 'Success',
      profile,
    };
  }

  async getDoctorProfileById(id: number) {
    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
            gender: true,
          },
        },
        reviewsReceived: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const { user, reviewsReceived, ...restProfile } = profile;

    const averageRating =
      reviewsReceived.length > 0
        ? reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
          reviewsReceived.length
        : null;
    return {
      message: 'Success',
      profile: {
        ...restProfile,
        fullName: `${user.firstName} ${user.lastName}`,
        avatarUrl: user.avatarUrl,
        gender: user.gender,
        averageRating,
      },
    };
  }

  async createEmptyProfile(userId: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      throw new UnauthorizedException('User not found');
    }

    const existing = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });
    if (existing) {
      throw new BadRequestException('Doctor profile already exists');
    }

    const createdProfile = await this.prisma.doctorProfile.create({
      data: {
        userId,
        title: '',
        specialization: '',
        yearsOfExperience: 0,
        consultationFee: 0,
        languages: [],
        isAcceptingNewPatients: false,
        stripeAccountId: null,
      },
    });

    return {
      message: 'Doctor profile created successfully',
      createdProfile,
    };
  }

  async updateDoctorProfile(user: any, dto: UpdateDoctorProfileDto) {
    const { userId, role } = user;

    if (role !== 'doctor') {
      throw new ForbiddenException('Only doctors can update their profile');
    }

    const existing = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('Doctor profile not found');
    }

    const updatedProfile = await this.prisma.doctorProfile.update({
      where: { userId },
      data: {
        ...dto,
      },
    });

    return {
      message: 'Doctor profile updated successfully',
      data: updatedProfile,
    };
  }

  async deleteDoctorProfile(user: any) {
    const { userId, role } = user;

    if (role !== 'doctor') {
      throw new ForbiddenException('Only doctors can delete their profile');
    }

    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    await this.prisma.doctorProfile.delete({
      where: { userId },
    });

    return { message: 'Doctor profile deleted successfully' };
  }
}
