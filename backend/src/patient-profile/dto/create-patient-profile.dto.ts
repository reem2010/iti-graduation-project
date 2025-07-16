import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiPropertyOptional({
    description: 'Name of the emergency contact person',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the emergency contact',
    example: '+201234567890',
  })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({
    description: "Name of the patient's insurance provider",
    example: 'Allianz Egypt',
  })
  @IsOptional()
  @IsString()
  insuranceProvider?: string;

  @ApiPropertyOptional({
    description: 'Insurance policy number for the patient',
    example: 'POL123456789',
  })
  @IsOptional()
  @IsString()
  insurancePolicyNumber?: string;
}
