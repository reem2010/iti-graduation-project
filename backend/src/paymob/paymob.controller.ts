// src/paymob/paymob.controller.ts

import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { PaymentService } from 'src/payment/payment.service';

@Controller('paymob')
export class PaymobController {
  constructor(private readonly transactionService: PaymentService) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() body: any) {
    await this.transactionService.recordFromWebhook(body);
    return { received: true };
  }
}
