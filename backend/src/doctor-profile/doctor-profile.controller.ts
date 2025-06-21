import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { DoctorProfileService } from './doctor-profile.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';

@Controller('doctors')
@UseGuards(JwtAuthGuard)
export class DoctorProfileController {
  constructor(private readonly doctorService: DoctorProfileService) {}

  @Get('')
  getProfile(@Req() req) {
    return this.doctorService.getDoctorProfile(req.user);
  }
  @Post()
  create(@Req() req, @Body() dto: CreateDoctorProfileDto) {
    return this.doctorService.createDoctorProfile(req.user, dto);
  }

  @Put()
  update(@Req() req, @Body() dto: UpdateDoctorProfileDto) {
    return this.doctorService.updateDoctorProfile(req.user, dto);
  }

  @Delete()
  delete(@Req() req) {
    return this.doctorService.deleteDoctorProfile(req.user);
  }
}
