import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { ZoomService } from '../zoom/zoom.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, ZoomService, PrismaService],
})
export class AppointmentsModule {}