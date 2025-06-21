import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorVerificationDto } from './create-doctor-verification.dto';

export class UpdateDoctorVerificationDto extends PartialType(
  CreateDoctorVerificationDto,
) {}
