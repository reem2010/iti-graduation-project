import { Module } from '@nestjs/common';
import { PatientService } from './patient-profile.service';
import { PatientController } from './patient-profile.contoller';

@Module({
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
