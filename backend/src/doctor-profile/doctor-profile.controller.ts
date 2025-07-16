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
import {
  ApiTagsDoctors,
  ApiGetOwnProfile,
  ApiGetDoctorById,
  ApiCreateEmptyProfile,
  ApiUpdateProfile,
  ApiDeleteProfile,
} from './doctor-profile.swagger';

@Controller('doctors')
export class DoctorProfileController {
  constructor(private readonly doctorService: DoctorProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiGetOwnProfile()
  getProfile(@Req() req) {
    return this.doctorService.getDoctorProfile(req.user);
  }
  @Get(':id')
  @ApiGetDoctorById()
  getDoctorProfileById(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.getDoctorProfileById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreateEmptyProfile()
  create(@Req() req) {
    return this.doctorService.createEmptyProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiUpdateProfile()
  update(@Req() req, @Body() dto: UpdateDoctorProfileDto) {
    return this.doctorService.updateDoctorProfile(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiDeleteProfile()
  delete(@Req() req) {
    return this.doctorService.deleteDoctorProfile(req.user);
  }
}
