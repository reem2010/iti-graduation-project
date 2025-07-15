// src/paymob/paymob.controller.ts

import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { TransactionService } from 'src/transaction/transaction.service';

@Controller('paymob')
export class PaymobController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() body: any) {
    console.log(body);
    await this.transactionService.recordFromWebhook(body);
    return { received: true };
  }
}
