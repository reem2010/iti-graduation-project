import { Module, forwardRef } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationFacade } from './notification.facade';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [forwardRef(() => RealtimeModule)],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationFacade],
  exports: [NotificationService, NotificationFacade],
})
export class NotificationModule {}
