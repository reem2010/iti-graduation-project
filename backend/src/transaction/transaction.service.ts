import { Inject, forwardRef, Injectable, NotFoundException } from '@nestjs/common';
import { PaymobService } from 'src/paymob/paymob.service';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionStatus, TransactionType } from '@prisma/client';
import { AppointmentsService } from 'src/appointment/appointments.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly paymobService: PaymobService,
    private readonly prisma: PrismaService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async bookSession(
    appointmentId: number,
    userId: number,
    amount: number,
    email: string,
    phone: string,
  ): Promise<string> {
    const iframeId = process.env.PAYMOB_IFRAME_ID;

    // Check for existing pending transaction
    const existingTx = await this.prisma.transaction.findFirst({
      where: {
        appointmentId,
        userId,
        type: TransactionType.payment,
        status: TransactionStatus.pending,
      },
    });

    if (existingTx) {
      const { orderId } = existingTx.metadata as { orderId: number };

      const existingToken = await this.paymobService.generatePaymentKey(
        amount,
        orderId,
        email,
        phone,
      );

      return `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${existingToken}`;
    }

    // Create a new Paymob order
    const newOrderId = await this.paymobService.createOrder(
      amount,
      `apt-${appointmentId}-${Date.now()}`,
    );

    const newToken = await this.paymobService.generatePaymentKey(
      amount,
      newOrderId,
      email,
      phone,
    );

    // Save new pending transaction with orderId
    await this.prisma.transaction.create({
      data: {
        userId,
        appointmentId,
        amount,
        type: TransactionType.payment,
        status: TransactionStatus.pending,
        metadata: { orderId: newOrderId },
        description: 'Pending payment via Paymob',
      },
    });

    return `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${newToken}`;
  }

  async refundToBank(appointmentId: number): Promise<string> {
    const paymentTx = await this.prisma.transaction.findFirst({
      where: {
        appointmentId,
        type: TransactionType.payment,
        status: TransactionStatus.completed,
      },
    });

    if (!paymentTx) {
      throw new NotFoundException('Completed payment not found');
    }

    const meta = paymentTx.metadata as {
      orderId?: string;
      transactionId?: string;
    };

    const transactionId = meta.transactionId;
    if (!transactionId) {
      throw new Error('Missing transactionId in metadata');
    }

    // Trigger refund using the Paymob transaction ID
    await this.paymobService.refund(transactionId);

    // Create a pending refund transaction
    await this.prisma.transaction.create({
      data: {
        userId: paymentTx.userId,
        appointmentId,
        amount: paymentTx.amount,
        type: TransactionType.refund,
        status: TransactionStatus.pending,
        description: 'Refund to bank requested',
        metadata: { originalTransactionId: transactionId, method: 'bank' },
      },
    });

    return 'Refund requested from Paymob';
  }

  async recordFromWebhook(data: any): Promise<void> {
    const {
      order: { id: paymobOrderId },
      success,
      source_data,
      is_refund,
      id: paymobTxId,
    } = data;

    const status = success
      ? TransactionStatus.completed
      : TransactionStatus.failed;

    const lookupKey = is_refund ? 'originalTransactionId' : 'orderId';
    const lookupValue = is_refund ? paymobTxId : paymobOrderId;

    // Find the pending transaction
    const pending = await this.prisma.transaction.findFirst({
      where: {
        type: is_refund ? TransactionType.refund : TransactionType.payment,
        status: TransactionStatus.pending,
        metadata: { path: [lookupKey], equals: lookupValue },
      },
    });

    if (!pending) return;

    const updatedMetadata = {
      ...(typeof pending.metadata === 'object' && pending.metadata !== null
        ? pending.metadata
        : {}),
      transactionId: paymobTxId,
      source: source_data,
      is_refund,
    };

    await this.prisma.transaction.update({
      where: { id: pending.id },
      data: {
        status,
        metadata: updatedMetadata,
        description: is_refund
          ? success
            ? 'Refund success via Paymob'
            : 'Refund failed via Paymob'
          : success
            ? 'Payment success via Paymob'
            : 'Payment failed via Paymob',
      },
    });
    //Handle appointment creation/cancellation based on payment result
    if (!is_refund && pending.appointmentId) {
      if (success) {
        // If payment succeeded, update appointment status to scheduled
        await this.appointmentsService.confirmAppointmentPayment(pending.appointmentId);
        console.log(`Appointment ${pending.appointmentId} confirmed after successful payment`);

      } else {
        // If payment failed, cancel the appointment
        await this.appointmentsService.handleFailedPayment(pending.appointmentId);
        console.log(`Appointment ${pending.appointmentId} cancelled due to failed payment`);
      }
    }
  }


  async getAllTransactions() {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTransactionsByUser(userId: number) {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return transactions;
  }
  //Get transactions by appointment
  async getTransactionsByAppointment(appointmentId: number) {
    const transactions = await this.prisma.transaction.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'desc' },
    });

    return transactions;
  }

  //Check if appointment has pending payment
  async hasPendingPayment(appointmentId: number): Promise<boolean> {
    const pendingTx = await this.prisma.transaction.findFirst({
      where: {
        appointmentId,
        type: TransactionType.payment,
        status: TransactionStatus.pending,
      },
    });

    return !!pendingTx;
  }

  // Check if appointment payment is completed
  async isPaymentCompleted(appointmentId: number): Promise<boolean> {
    const completedTx = await this.prisma.transaction.findFirst({
      where: {
        appointmentId,
        type: TransactionType.payment,
        status: TransactionStatus.completed,
      },
    });
    return !!completedTx;
  }
}
