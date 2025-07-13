import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymobService } from './paymob.service';

@Module({
  imports: [HttpModule],
  providers: [PaymobService],
  exports: [PaymobService],
})
export class PaymobModule {}
