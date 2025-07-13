import {forwardRef, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PaymobService } from 'src/paymob/paymob.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppointmentsModule } from 'src/appointment/appointments.module';

@Module({
  imports: [HttpModule, ConfigModule, forwardRef(() => AppointmentsModule)],
  controllers: [TransactionController],
  providers: [TransactionService, PaymobService, PrismaService],
  exports: [TransactionService],
})
export class TransactionModule {}
