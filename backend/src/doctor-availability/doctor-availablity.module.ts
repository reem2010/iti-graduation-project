import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DoctorAvailabilityService } from './doctor-availablity.service';
import { DoctorAvailabilityController } from './doctor-availablity.controller';

@Module({
  controllers: [DoctorAvailabilityController],
  providers: [DoctorAvailabilityService, PrismaService],
})
export class DoctorAvailabilityModule {}
