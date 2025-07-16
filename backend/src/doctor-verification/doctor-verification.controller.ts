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
import { UpdateDoctorVerificationDto } from './dto/update-doctor-verification.dto';
import { ReviewDoctorVerificationDto } from './dto/review-doctor-verification.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import {
  ApiTagsDoctorVerification,
  ApiGetOwnVerification,
  ApiGetVerificationByDoctorId,
  ApiCreateVerification,
  ApiUpdateVerification,
  ApiDeleteVerification,
  ApiReviewVerification,
} from './doctor-verification.swagger';

@Controller('doctor-verification')
export class DoctorVerificationController {
  constructor(
    private readonly doctorVerificationService: DoctorVerificationService,
  ) {}

  // 1. Get own verification
  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiGetOwnVerification()
  getDoctorVerification(@Req() req) {
    return this.doctorVerificationService.getDoctorVerification(req.user);
  }

  // 2. Get other doctor's verification (e.g., for admin/patient view)
  @Get('doctor/:doctorId')
  @ApiGetVerificationByDoctorId()
  getVerificationByDoctorId(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.doctorVerificationService.getVerificationByDoctorId(doctorId);
  }

  // 3. Create
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreateVerification()
  createDoctorVerification(@Req() req) {
    return this.doctorVerificationService.createDefaultVerification(
      req.user.userId,
    );
  }

  // 4. Update
  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiUpdateVerification()
  updateDoctorVerification(
    @Req() req,
    @Body() dto: UpdateDoctorVerificationDto,
  ) {
    return this.doctorVerificationService.updateDoctorVerification(
      req.user,
      dto,
    );
  }

  // 5. Delete
  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiDeleteVerification()
  deleteDoctorVerification(@Req() req) {
    return this.doctorVerificationService.deleteDoctorVerification(req.user);
  }

  // 6. Review (Admin)
  @UseGuards(JwtAuthGuard)
  @Put(':id/review')
  @ApiReviewVerification()
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
