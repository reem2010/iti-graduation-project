import { Module } from '@nestjs/common';
import { DoctorVerificationController } from './doctor-verification.controller';
import { DoctorVerificationService } from './doctor-verification.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [DoctorVerificationController],
  providers: [DoctorVerificationService],
  exports: [DoctorVerificationService],
})
export class DoctorVerificationModule {}
