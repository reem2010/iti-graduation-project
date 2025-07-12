import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymobService {
  private authToken: string | null = null;

  constructor(
    private http: HttpService,
    private config: ConfigService,
  ) {}

  async authenticate(): Promise<string> {
    if (this.authToken) return this.authToken;

    const apiKey = this.config.get<string>('PAYMOB_API_KEY');

    const response$ = this.http.post(
      'https://accept.paymob.com/api/auth/tokens',
      {
        api_key: apiKey,
      },
    );

    const response = await firstValueFrom(response$);
    const token = response.data.token;

    this.authToken = token;
    return token;
  }

  async createOrder(amount: number, merchantOrderId?: string): Promise<number> {
    const token = await this.authenticate();

    const orderData = {
      auth_token: token,
      delivery_needed: false,
      amount_cents: (amount * 100).toString(),
      currency: 'EGP',
      merchant_order_id: merchantOrderId ?? undefined,
      items: [],
    };

    const response$ = this.http.post(
      'https://accept.paymob.com/api/ecommerce/orders',
      orderData,
    );

    const response = await firstValueFrom(response$);
    return response.data.id;
  }

  async generatePaymentKey(
    amount: number,
    orderId: number,
    userEmail: string,
    userPhone: string,
  ): Promise<string> {
    const token = await this.authenticate();

    const requestData = {
      auth_token: token,
      amount_cents: (amount * 100).toString(),
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        email: userEmail,
        phone_number: userPhone,
        first_name: 'user',
        last_name: 'user',
        apartment: 'NA',
        floor: 'NA',
        street: 'NA',
        building: 'NA',
        city: 'Cairo',
        country: 'EG',
        state: 'NA',
      },
      currency: 'EGP',
      integration_id: +this.config.get('PAYMOB_INTEGRATION_ID'),
    };

    const response$ = this.http.post(
      'https://accept.paymob.com/api/acceptance/payment_keys',
      requestData,
    );

    const response = await firstValueFrom(response$);
    return response.data.token;
  }

  async refund(paymobTransactionId: string): Promise<void> {
    const token = await this.authenticate();

    const response$ = this.http.post(
      'https://accept.paymob.com/api/acceptance/void_refund/refund',
      {
        auth_token: token,
        transaction_id: paymobTransactionId,
      },
    );

    const response = await firstValueFrom(response$);

    if (!response.data || !response.data.success) {
      throw new Error('Refund failed at Paymob');
    }
  }
}
