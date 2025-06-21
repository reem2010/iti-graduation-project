import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient-profile/patient-profile.module';
import { DoctorProfileModule } from './doctor-profile/doctor-profile.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ArticlesModel } from './article/article.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PatientModule,
    DoctorProfileModule,
    ArticlesModel,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
