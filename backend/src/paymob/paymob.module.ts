import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymobService } from './paymob.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { PaymobController } from './paymob.controller';

@Module({
  imports: [HttpModule, TransactionModule],
  providers: [PaymobService],
  controllers: [PaymobController],
  exports: [PaymobService],
})
export class PaymobModule {}
