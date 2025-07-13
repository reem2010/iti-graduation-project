// src/payment/payment.controller.ts
import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('payment')
export class TransactionController {
  constructor(private readonly paymentService: TransactionService) {}

  @Get('test/book')
  async testBookSession(
    @Query('appointmentId') appointmentId: string,
    @Query('userId') userId: string,
    @Query('amount') amount: string,
    @Query('email') email: string,
    @Query('phone') phone: string,
  ) {
    return this.paymentService.bookSession(
      +appointmentId,
      +userId,
      +amount,
      email,
      phone,
    );
  }

  @Get('test/refund')
  async testRefund(@Query('appointmentId') appointmentId: string) {
    return this.paymentService.refundToBank(+appointmentId);
  }

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
