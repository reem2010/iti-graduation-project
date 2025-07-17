import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsNumber,
  IsArray,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDoctorProfileDto {
  @ApiProperty({
    description: 'Professional title of the doctor',
    example: 'Psychiatrist',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Medical specialization of the doctor',
    example: 'Mental Health',
  })
  @IsString()
  specialization: string;

  @ApiProperty({
    description: 'Years of experience in the medical field',
    example: 10,
    minimum: 0,
  })
  @IsInt()
  yearsOfExperience: number;

  @ApiProperty({
    description: 'Fee charged for consultations',
    example: 500,
    minimum: 0,
  })
  @IsNumber()
  consultationFee: number;

  @ApiProperty({
    description: 'Languages spoken by the doctor',
    example: ['English', 'Arabic'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiPropertyOptional({
    description: "Doctor's approach or methodology in treatment",
    example: 'Cognitive Behavioral Therapy',
  })
  @IsOptional()
  @IsString()
  approach?: string;

  @ApiPropertyOptional({
    description: 'Is the doctor currently accepting new patients?',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAcceptingNewPatients?: boolean;

  @ApiPropertyOptional({
    description: 'Stripe account ID for payments',
    example: 'acct_1Hh1JY2eZvKYlo2C',
  })
  @IsOptional()
  @IsString()
  stripeAccountId?: string;
}
