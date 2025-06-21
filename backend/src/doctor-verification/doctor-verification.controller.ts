import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { DoctorVerificationService } from './doctor-verification.service';
import { CreateDoctorVerificationDto } from './dto/create-doctor-verification.dto';
import { UpdateDoctorVerificationDto } from './dto/update-doctor-verification.dto';
import { ReviewDoctorVerificationDto } from './dto/review-doctor-verification.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('doctor-verification')
@UseGuards(JwtAuthGuard)
export class DoctorVerificationController {
  constructor(
    private readonly doctorVerificationService: DoctorVerificationService,
  ) {}

  @Get('')
  getDoctorVerification(@Req() req) {
    return this.doctorVerificationService.getDoctorVerification(req.user);
  }

  @Post()
  createDoctorVerification(
    @Req() req,
    @Body() dto: CreateDoctorVerificationDto,
  ) {
    return this.doctorVerificationService.createDoctorVerification(
      req.user,
      dto,
    );
  }

  @Put()
  updateDoctorVerification(
    @Req() req,
    @Body() dto: UpdateDoctorVerificationDto,
  ) {
    return this.doctorVerificationService.updateDoctorVerification(
      req.user,
      dto,
    );
  }

  @Delete()
  deleteDoctorVerification(@Req() req) {
    return this.doctorVerificationService.deleteDoctorVerification(req.user);
  }

  @Put(':id/review')
  reviewDoctorVerification(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() dto: ReviewDoctorVerificationDto,
  ) {
    return this.doctorVerificationService.reviewDoctorVerification(
      id,
      req.user,
      dto,
    );
  }
}
