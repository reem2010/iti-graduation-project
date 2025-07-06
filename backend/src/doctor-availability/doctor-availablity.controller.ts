import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  Req,
  Put,
} from '@nestjs/common';
import { CreateDoctorAvailabilityDto } from './dto/create-doctor-availability.dto';
import { UpdateDoctorAvailabilityDto } from './dto/update-doctor-availability.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { DoctorAvailabilityService } from './doctor-availablity.service';

@UseGuards(JwtAuthGuard)
@Controller('doctor-availability')
export class DoctorAvailabilityController {
  constructor(
    private readonly doctorAvailabilityService: DoctorAvailabilityService,
  ) {}

  @Get()
  async getDoctorAvailabilities(@Req() user: any) {
    return this.doctorAvailabilityService.getDoctorAvailabilities(user);
  }
  @Get(':id')
  async getDoctorAvailabilityById(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.doctorAvailabilityService.getDoctorAvailabilityById(
      req.user,
      id,
    );
  }

  @Post()
  async createDoctorAvailability(
    @Req() req,
    @Body() dto: CreateDoctorAvailabilityDto,
  ) {
    return this.doctorAvailabilityService.createDoctorAvailability(
      req.user,
      dto,
    );
  }

  @Put(':id')
  async updateDoctorAvailability(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDoctorAvailabilityDto,
  ) {
    return this.doctorAvailabilityService.updateDoctorAvailability(
      req.user,
      id,
      dto,
    );
  }

  @Delete(':id')
  async deleteDoctorAvailability(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.doctorAvailabilityService.deleteDoctorAvailability(
      req.user,
      id,
    );
  }
}
