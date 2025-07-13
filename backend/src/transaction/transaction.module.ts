import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from 'prisma/prisma.service';
import { PaymobService } from 'src/paymob/paymob.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [TransactionController],
  providers: [TransactionService, PaymobService, PrismaService],
})
export class TransactionModule {}
