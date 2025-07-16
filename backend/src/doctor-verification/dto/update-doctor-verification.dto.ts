import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDoctorVerificationDto {
  @ApiPropertyOptional({
    description: 'Professional license number of the doctor',
    example: 'MD-12345678',
  })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({
    description: 'URL to the uploaded license photo',
    example: 'https://example.com/uploads/license.jpg',
  })
  @IsOptional()
  @IsString()
  licensePhotoUrl?: string;

  @ApiPropertyOptional({
    description: 'Academic degree obtained',
    example: 'MBBS',
  })
  @IsOptional()
  @IsString()
  degree?: string;

  @ApiPropertyOptional({
    description: 'University where the doctor graduated from',
    example: 'Harvard University',
  })
  @IsOptional()
  @IsString()
  university?: string;

  @ApiPropertyOptional({
    description: 'Year of graduation',
    example: 2010,
    minimum: 1950,
    maximum: new Date().getFullYear(),
  })
  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear())
  graduationYear?: number;

  @ApiPropertyOptional({
    description: 'Field of specialization',
    example: 'Psychiatry',
  })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiPropertyOptional({
    description: 'URL to uploaded ID proof',
    example: 'https://example.com/uploads/id-proof.jpg',
  })
  @IsOptional()
  @IsString()
  idProofUrl?: string;

  @ApiPropertyOptional({
    description: 'URL to uploaded CV',
    example: 'https://example.com/uploads/cv.pdf',
  })
  @IsOptional()
  @IsString()
  cvUrl?: string;

  @ApiPropertyOptional({
    description: 'List of additional certificates as URLs',
    example: [
      'https://example.com/uploads/certificate1.pdf',
      'https://example.com/uploads/certificate2.pdf',
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalCertificates?: string[];
}
