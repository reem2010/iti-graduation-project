import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'prisma/prisma.service';
import { DoctorProfileService } from 'src/doctor-profile/doctor-profile.service';
import { DoctorVerificationService } from 'src/doctor-verification/doctor-verification.service';
import { DoctorAvailabilityService } from 'src/doctor-availability/doctor-availablity.service';
import { WalletService } from 'src/wallet/wallet.service';
import { PatientService } from 'src/patient-profile/patient-profile.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private doctorProfileService: DoctorProfileService,
    private doctorVerificationService: DoctorVerificationService,
    private doctorAvailabilityService: DoctorAvailabilityService, // Assuming this is needed
    private walletService: WalletService,
    private patientService: PatientService, // Assuming this is needed
  ) {}

  async register(data: RegisterDto) {
    const { email, password, role, firstName, lastName, dateOfBirth, ...rest } =
      data;

    if (!email || !password || !role || !firstName || !lastName) {
      throw new BadRequestException('All fields are required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        ...rest,
      },
    });

    // If doctor, create empty profile & verification
    if (newUser.role === 'doctor') {
      await this.doctorProfileService.createEmptyProfile(newUser.id);
      await this.doctorVerificationService.createDefaultVerification(
        newUser.id,
      );
      await this.doctorAvailabilityService.createEmptyAvailability(newUser.id);
      await this.walletService.create({ userId: newUser.id, balance: 0 });
    } else if (newUser.role === 'patient') {
      await this.patientService.createPatientProfile(newUser.id);
    }

    return {
      message: 'User registered successfully',
      user: newUser,
    };
  }

  async login(data: LoginDto) {
    const { email, password } = data;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      access_token,
      user,
    };
  }
}
