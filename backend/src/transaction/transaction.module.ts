import { forwardRef, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PaymobService } from 'src/paymob/paymob.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppointmentsModule } from 'src/appointment/appointments.module';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';
import { NotificationModule } from '../notification/notification.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    forwardRef(() => AppointmentsModule),
    NotificationModule,
    MessagesModule,
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    PaymobService,
    PrismaService,
    RealtimeGateway,
  ],
  exports: [TransactionService],
})
export class TransactionModule {}
