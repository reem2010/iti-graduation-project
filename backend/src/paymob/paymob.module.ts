import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymobService } from './paymob.service';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [HttpModule, TransactionModule],
  providers: [PaymobService],
  exports: [PaymobService],
})
export class PaymobModule {}
