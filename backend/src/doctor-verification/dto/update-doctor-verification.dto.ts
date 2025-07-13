import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsArray,
} from 'class-validator';

export class UpdateDoctorVerificationDto {
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  licensePhotoUrl?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear())
  graduationYear?: number;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  idProofUrl?: string;

  @IsOptional()
  @IsString()
  cvUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // ensures every element in array is a string
  additionalCertificates?: string[];
}
