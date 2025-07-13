import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: any) {
    const {
      search,
      language,
      gender,
      isAcceptingNewPatients,
      minExperience,
      maxFee,
    } = filters;

    const where: any = {
      role: 'doctor',
      isActive: true,
      isVerified: true,
      doctorProfile: {
        isNot: null,
      },
    };

    if (gender) where.gender = gender;

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        {
          doctorProfile: {
            is: {
              specialization: { contains: search, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    const doctorProfileFilters: any = {};

    if (isAcceptingNewPatients !== undefined) {
      doctorProfileFilters.isAcceptingNewPatients =
        isAcceptingNewPatients === 'true';
    }

    if (minExperience) {
      doctorProfileFilters.yearsOfExperience = {
        gte: parseInt(minExperience),
      };
    }

    if (maxFee) {
      doctorProfileFilters.consultationFee = {
        lte: parseFloat(maxFee),
      };
    }

    if (language) {
      doctorProfileFilters.languages = {
        has: language,
      };
    }

    if (Object.keys(doctorProfileFilters).length > 0) {
      where.doctorProfile = {
        isNot: null,
        is: doctorProfileFilters,
      };
    }

    const doctors = await this.prisma.user.findMany({
      where,
      include: {
        doctorProfile: {
          include: {
            reviewsReceived: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    const result = doctors.map((doc) => {
      const ratings = doc.doctorProfile?.reviewsReceived || [];
      const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
      const avgRating =
        ratings.length > 0 ? totalRating / ratings.length : null;

      return {
        id: doc.id,
        fullName: `${doc.firstName} ${doc.lastName}`,
        avatarUrl: doc.avatarUrl,
        gender: doc.gender,
        bio: doc.bio,
        averageRating: avgRating,
        ...doc.doctorProfile,
      };
    });

    return result;
  }
}
