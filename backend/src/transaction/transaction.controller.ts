// src/payment/payment.controller.ts
import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('payment')
export class TransactionController {
  constructor(private readonly paymentService: TransactionService) {}

  @Get()
  getAll() {
    return this.paymentService.getAllTransactions();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  find(@Request() req: any) {
    return this.paymentService.getTransactionsByUser(req.user.userId);
  }
}
