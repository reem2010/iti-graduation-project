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
import { PatientService } from './patient-profile.service';
import { CreatePatientDto } from './dto/create-patient-profile.dto';
import { UpdatePatientDto } from './dto/update-patient-profile.dto';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('')
  getPatientProfile(@Req() req) {
    return this.patientService.getPatientProfile(req.user);
  }

  @Post()
  createPatientProfile(@Req() req, @Body() dto: CreatePatientDto) {
    return this.patientService.createPatientProfile(req.user, dto);
  }

  @Put()
  updatePatientProfile(@Req() req, @Body() dto: UpdatePatientDto) {
    return this.patientService.updatePatientProfile(req.user, dto);
  }

  @Delete()
  deletePatientProfile(@Req() req) {
    return this.patientService.deletePatientProfile(req.user);
  }
}
