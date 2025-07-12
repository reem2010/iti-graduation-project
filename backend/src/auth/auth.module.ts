import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { DoctorProfileModule } from 'src/doctor-profile/doctor-profile.module';
import { DoctorAvailabilityModule } from 'src/doctor-availability/doctor-availablity.module';
import { DoctorVerificationModule } from 'src/doctor-verification/doctor-verification.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { PatientModule } from 'src/patient-profile/patient-profile.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secret123',
      signOptions: { expiresIn: '1d' },
    }),
    DoctorProfileModule,
    DoctorAvailabilityModule,
    DoctorVerificationModule,
    WalletModule,
    PatientModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
