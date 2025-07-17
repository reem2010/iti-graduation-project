import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ReviewService } from './review.service';
import { CreateReviewsDto, UpdateReviewsDto } from './dto/review.dto';
import {
  ApiReviewTags,
  ApiFindAllByDoctorId,
  ApiCreateReview,
  ApiUpdateReview,
} from './review.swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiFindAllByDoctorId()
  async findAllByDoctorId(@Param('id', ParseIntPipe) doctorId: number) {
    return this.reviewService.findAllByDoctorId(doctorId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiCreateReview()
  async create(
    @Body() createReviewsDto: CreateReviewsDto,
    @Request() req: any,
  ) {
    if (req.user.role != 'patient') {
      throw new ForbiddenException('Review only for patient');
    }
    const patientId = req.user.userId;
    return this.reviewService.create(createReviewsDto, patientId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/')
  @ApiUpdateReview()
  async update(
    @Body() updateReviewsDto: UpdateReviewsDto,
    @Request() req: any,
  ) {
    if (req.user.role != 'patient') {
      throw new ForbiddenException('Review only for patient');
    }
    const patientId = req.user.userId;
    return this.reviewService.update(updateReviewsDto, patientId);
  }
}
