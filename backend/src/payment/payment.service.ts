import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymobService } from 'src/paymob/paymob.service';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionStatus, TransactionType } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymobService: PaymobService,
    private prisma: PrismaService,
  ) {}

  async bookSession(
    amount: number,
    email: string,
    phone: string,
  ): Promise<string> {
    const orderId = await this.paymobService.createOrder(amount);

    const paymentToken = await this.paymobService.generatePaymentKey(
      amount,
      orderId,
      email,
      phone,
    );
    const iframeId = process.env.PAYMOB_IFRAME_ID;
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`;

    return iframeUrl;
  }

  async refundToBank(appointmentId: number): Promise<string> {
    const transaction = await this.findRelatedTransaction(appointmentId);

    const meta = transaction.metadata as { transactionId?: string };

    if (!meta.transactionId) {
      throw new Error('transactionId is missing in metadata');
    }
    await this.paymobService.refund(meta.transactionId);

    await this.prisma.transaction.create({
      data: {
        userId: transaction.userId,
        amount: transaction.amount,
        type: TransactionType.refund,
        status: TransactionStatus.pending,
        description: 'Refund to bank requested',
        metadata: {
          originalTransactionId: meta.transactionId,
          method: 'bank',
        },
      },
    });

    return 'Refund requested from Paymob';
  }

  async recordFromWebhook(data: any): Promise<void> {
    const {
      amount_cents,
      order,
      success,
      source_data,
      is_refund,
      id: transactionId,
    } = data;

    const amount = parseFloat(amount_cents) / 100;
    const userId = +order.merchant_order_id;

    const type = is_refund ? TransactionType.refund : TransactionType.payment;

    const status = success
      ? TransactionStatus.completed
      : TransactionStatus.failed;

    await this.prisma.transaction.create({
      data: {
        userId,
        amount,
        type,
        status,
        metadata: {
          transactionId,
          source: source_data,
          is_refund,
        },
        description: is_refund
          ? success
            ? 'Refund success via Paymob'
            : 'Refund failed via Paymob'
          : success
            ? 'Payment success via Paymob'
            : 'Payment failed',
      },
    });
  }
  private async findRelatedTransaction(appointmentId: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        appointmentId,
        type: TransactionType.payment,
        status: TransactionStatus.completed,
      },
    });

    if (!transaction) {
      throw new NotFoundException(
        'Completed transaction not found for appointment',
      );
    }

    return transaction;
  }
}
