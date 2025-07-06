import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
} from '@nestjs/class-validator';

export enum Role {
  patient = 'patient',
  doctor = 'doctor',
  admin = 'admin',
}

export class RegisterDto {
  @IsEmail()
  email: string;
    
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}
