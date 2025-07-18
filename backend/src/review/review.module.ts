import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [AuthModule, NotificationModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
