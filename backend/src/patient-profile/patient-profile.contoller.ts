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
import { PatientService } from './patient-profile.service';
import { CreatePatientDto } from './dto/create-patient-profile.dto';
import { UpdatePatientDto } from './dto/update-patient-profile.dto';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getPatientProfile(@Req() req) {
    return this.patientService.getPatientProfile(req.user);
  }
  @Get(':userId')
  getPatientProfileById(@Param('userId', ParseIntPipe) userId: number) {
    return this.patientService.getPatientProfileById(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  createPatientProfile(@Req() req, @Body() dto: CreatePatientDto) {
    return this.patientService.createPatientProfile(req.user, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Put()
  updatePatientProfile(@Req() req, @Body() dto: UpdatePatientDto) {
    return this.patientService.updatePatientProfile(req.user, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete()
  deletePatientProfile(@Req() req) {
    return this.patientService.deletePatientProfile(req.user);
  }
}
