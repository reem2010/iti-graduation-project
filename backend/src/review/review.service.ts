import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateReviewsDto, CreateReviewsDto } from './dto/review.dto';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}
  //Get All Doctor's Reviews
  async findAllByDoctorId(doctorId: number) {
    if (!doctorId || doctorId <= 0) {
      throw new BadRequestException('Invalid doctor ID');
    }
    const reviews = await this.prisma.review.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            userId: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((review) => ({
      ...review,
      patientId: review.isAnonymous ? null : review.patientId,
      patient: review.isAnonymous ? null : review.patient,
    }));
  }
  //Create Reviews
  async create(createReviewsDto: CreateReviewsDto, patientId: number) {
    const { rating, isAnonymous, comment, doctorId } = createReviewsDto;

    // 1-Check if  patient and doctor exist
    const [patient, doctor] = await Promise.all([
      this.prisma.patient.findUnique({ where: { userId: patientId } }),
      this.prisma.doctorProfile.findUnique({ where: { userId: doctorId } }),
    ]);

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // 2-Check if patient already reviewed this doctor to deny him from re reviwe again
    const existingReview = await this.prisma.review.findFirst({
      where: { patientId, doctorId },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this doctor');
    }

    const review = await this.prisma.review.create({
      data: {
        doctorId,
        patientId,
        isAnonymous,
        rating,
        comment,
      },
      include: {
        patient: {
          select: {
            userId: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
        doctorProfile: {
          select: {
            userId: true,
          },
        },
      },
    });

    return {
      ...review,
      patientId: review.isAnonymous ? null : review.patientId,
      patient: review.isAnonymous ? null : review.patient,
    };
  }
  //Update Reviews
  async update(updateReviewsDto: UpdateReviewsDto, patientId: number) {
    const { id, rating, isAnonymous, comment } = updateReviewsDto;
    const existedReview = await this.prisma.review.findUnique({
      where: { id },
    });
    if (!existedReview) {
      throw new NotFoundException('Review not found');
    }
    if (patientId != existedReview.patientId) {
      throw new ForbiddenException("Update allowed only for review's writer");
    }
    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: {
        rating,
        isAnonymous,
        comment,
      },
      include: {
        patient: {
          select: {
            userId: true,
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    return {
      ...updatedReview,
      patientId: updatedReview.isAnonymous ? null : updatedReview.patientId,
      patient: updatedReview.isAnonymous ? null : updatedReview.patient,
    };
  }
}
