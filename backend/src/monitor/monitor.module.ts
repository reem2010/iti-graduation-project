import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppointmentMonitorService } from './appointment-monitor.service';
import { PrismaService } from 'prisma/prisma.service';
import { AppointmentsModule } from '..//appointment/appointments.module';

@Module({
  imports: [ScheduleModule.forRoot(), AppointmentsModule],
  providers: [AppointmentMonitorService, PrismaService],
})
export class MonitorModule {}
