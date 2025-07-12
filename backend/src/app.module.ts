import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient-profile/patient-profile.module';
import { DoctorProfileModule } from './doctor-profile/doctor-profile.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ArticlesModel } from './article/article.module';
import { ReviewModule } from './review/review.module';
import { DoctorVerificationModule } from './doctor-verification/doctor-verification.module';
import { DoctorAvailabilityModule } from './doctor-availability/doctor-availablity.module';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { PaymobModule } from './paymob/paymob.module';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointment/appointments.module';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    PrismaModule,

    AuthModule,

    PatientModule,

    DoctorProfileModule,
    ArticlesModel,
    ReviewModule,
    ,
    DoctorVerificationModule,
    DoctorAvailabilityModule,
    TransactionModule,
    PaymobModule,
    WalletModule,
    UserModule,
    DoctorsModule,
    AppointmentsModule,

    MessagesModule,

    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
