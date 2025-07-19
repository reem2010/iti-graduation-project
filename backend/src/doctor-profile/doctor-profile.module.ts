import { Module } from '@nestjs/common';
import { DoctorProfileController } from './doctor-profile.controller';
import { DoctorProfileService } from './doctor-profile.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [DoctorProfileController],
  providers: [DoctorProfileService],
  exports: [DoctorProfileService],
})
export class DoctorProfileModule {}
