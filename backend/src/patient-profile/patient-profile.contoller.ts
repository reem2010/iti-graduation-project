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
import { UpdatePatientDto } from './dto/update-patient-profile.dto';
import {
  ApiTagsPatient,
  ApiGetPatientProfileById,
  ApiGetOwnPatientProfile,
  ApiCreatePatientProfile,
  ApiUpdatePatientProfile,
  ApiDeletePatientProfile,
} from './patient.swagger';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}
  @Get(':userId')
  @ApiGetPatientProfileById()
  getPatientProfileById(@Param('userId', ParseIntPipe) userId: number) {
    return this.patientService.getPatientProfileById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiGetOwnPatientProfile()
  getPatientProfile(@Req() req) {
    return this.patientService.getPatientProfile(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatePatientProfile()
  createPatientProfile(@Req() req) {
    return this.patientService.createPatientProfile(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiUpdatePatientProfile()
  updatePatientProfile(@Req() req, @Body() dto: UpdatePatientDto) {
    return this.patientService.updatePatientProfile(req.user, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiDeletePatientProfile()
  deletePatientProfile(@Req() req) {
    return this.patientService.deletePatientProfile(req.user);
  }
}
