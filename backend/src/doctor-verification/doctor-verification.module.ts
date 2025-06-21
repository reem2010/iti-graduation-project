import { Module } from '@nestjs/common';
import { DoctorVerificationController } from './doctor-verification.controller';
import { DoctorVerificationService } from './doctor-verification.service';

@Module({
  controllers: [DoctorVerificationController],
  providers: [DoctorVerificationService],
})
export class DoctorVerificationModule {}
