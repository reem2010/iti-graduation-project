import { IsBoolean, IsDateString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorAvailabilityDto {
  @ApiProperty({
    example: 1,
    description:
      'Day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)',
  })
  @IsInt()
  dayOfWeek: number;

  @ApiProperty({
    example: '2025-07-18T09:00:00.000Z',
    description: 'Start time of the availability (ISO 8601 format)',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    example: '2025-07-18T11:00:00.000Z',
    description: 'End time of the availability (ISO 8601 format)',
  })
  @IsDateString()
  endTime: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the availability is recurring weekly',
  })
  @IsBoolean()
  isRecurring: boolean;

  @ApiProperty({
    example: '2025-07-18',
    description:
      'Date from which this availability is valid (YYYY-MM-DD format)',
  })
  @IsDateString()
  validFrom: string;

  @ApiPropertyOptional({
    example: '2025-12-31',
    description:
      'Optional date until which this availability is valid (YYYY-MM-DD format)',
  })
  @IsDateString()
  validUntil?: string;
}
