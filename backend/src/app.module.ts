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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,

    AuthModule,

    PatientModule,

    DoctorProfileModule,
    ArticlesModel,
    ReviewModule,

    DoctorVerificationModule,
    DoctorAvailabilityModule,
    TransactionModule,
    PaymobModule,
    WalletModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
