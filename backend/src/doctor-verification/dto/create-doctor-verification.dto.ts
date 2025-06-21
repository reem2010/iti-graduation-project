import { IsString, IsInt, IsOptional, IsUrl, Min, Max } from 'class-validator';

export class CreateDoctorVerificationDto {
  @IsString()
  licenseNumber: string;

  @IsUrl()
  licensePhotoUrl: string;

  @IsString()
  degree: string;

  @IsString()
  university: string;

  @IsInt()
  @Min(1950)
  @Max(new Date().getFullYear())
  graduationYear: number;

  @IsString()
  specialization: string;

  @IsUrl()
  idProofUrl: string;

  @IsOptional()
  @IsUrl()
  cvUrl?: string;

  @IsOptional()
  additionalCertificates?: any; // JSON object
}
