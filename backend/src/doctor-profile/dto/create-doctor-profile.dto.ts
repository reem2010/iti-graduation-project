import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsNumber,
  IsArray,
} from '@nestjs/class-validator';

export class CreateDoctorProfileDto {
  @IsString()
  title: string;

  @IsString()
  specialization: string;

  @IsInt()
  yearsOfExperience: number;

  @IsNumber()
  consultationFee: number;

  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @IsOptional()
  @IsString()
  approach?: string;

  @IsOptional()
  @IsBoolean()
  isAcceptingNewPatients?: boolean;

  @IsOptional()
  @IsString()
  stripeAccountId?: string;
}
