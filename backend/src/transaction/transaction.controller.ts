// src/payment/payment.controller.ts
import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import {
  PaymentControllerDocs,
  GetAllTransactionsDocs,
  GetUserTransactionsDocs,
} from './payment.swagger';

@PaymentControllerDocs()
@Controller('payment')
export class TransactionController {
  constructor(private readonly paymentService: TransactionService) {}

  @Get()
  @GetAllTransactionsDocs()
  getAll() {
    return this.paymentService.getAllTransactions();
  }

  @Get('/me')
  @GetUserTransactionsDocs()
  @UseGuards(JwtAuthGuard)
  find(@Request() req: any) {
    return this.paymentService.getTransactionsByUser(req.user.userId);
  }
}
