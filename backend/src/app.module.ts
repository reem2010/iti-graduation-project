import { forwardRef, Module } from '@nestjs/common';
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
import { TransactionModule } from './transaction/transaction.module';
import { PaymobModule } from './paymob/paymob.module';
import { WalletModule } from './wallet/wallet.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointment/appointments.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';
import { NotificationModule } from './notification/notification.module';
import { RealtimeModule } from './realtime/realtime.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { JwtStrategy } from './auth/jwt/jwt.strategy';

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
    forwardRef(() => TransactionModule),
    forwardRef(() => AppointmentsModule),
    PaymobModule,
    WalletModule,
    AppointmentsModule,
    UserModule,
    DoctorsModule,
    MessagesModule,
    NotificationModule,
    RealtimeModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
