import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorAvailabilityDto } from './create-doctor-availability.dto';

export class UpdateDoctorAvailabilityDto extends PartialType(
  CreateDoctorAvailabilityDto,
) {}
