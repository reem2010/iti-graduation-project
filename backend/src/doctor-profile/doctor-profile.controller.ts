import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { DoctorProfileService } from './doctor-profile.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';

@Controller('doctors')
export class DoctorProfileController {
  constructor(private readonly doctorService: DoctorProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  getProfile(@Req() req) {
    return this.doctorService.getDoctorProfile(req.user);
  }
  @Get(':id')
  getDoctorProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.getDoctorProfileById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateDoctorProfileDto) {
    return this.doctorService.createDoctorProfile(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req() req, @Body() dto: UpdateDoctorProfileDto) {
    return this.doctorService.updateDoctorProfile(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Req() req) {
    return this.doctorService.deleteDoctorProfile(req.user);
  }
}
