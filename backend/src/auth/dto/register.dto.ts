import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
  IsDateString,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Role {
  patient = 'patient',
  doctor = 'doctor',
  admin = 'admin',
}

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    minLength: 6,
    description: 'User password (minimum 6 characters)',
  })
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: Role,
    description: 'Role of the user (patient, doctor, admin)',
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({
    example: '+201234567890',
    description: 'Phone number of the user',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: '1995-05-15',
    description: 'Date of birth in YYYY-MM-DD format',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'female', description: 'Gender of the user' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({
    example: 'Experienced therapist',
    description: 'Short biography about the user',
  })
  @IsOptional()
  @IsString()
  bio?: string;
}
