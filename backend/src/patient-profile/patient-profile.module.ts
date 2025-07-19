import { Module } from '@nestjs/common';
import { PatientService } from './patient-profile.service';
import { PatientController } from './patient-profile.contoller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
