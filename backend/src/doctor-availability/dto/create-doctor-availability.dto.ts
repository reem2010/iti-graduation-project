import { IsBoolean, IsDateString, IsInt } from 'class-validator';

export class CreateDoctorAvailabilityDto {
  @IsInt()
  dayOfWeek: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsBoolean()
  isRecurring: boolean;

  @IsDateString()
  validFrom: string;

  @IsDateString()
  validUntil?: string;
}
