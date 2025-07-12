import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL, {
        tls: {}, // Enable TLS if your Redis server requires it
    });

    this.client.on('error', (err) => {
      console.error('[Redis Error]', err.message);
    });

    this.client.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });

    this.client.on('reconnecting', () => {
      console.warn('[Redis] Reconnecting...');
    });

    this.client.on('end', () => {
      console.warn('[Redis] Connection closed');
    });
  }

  getClient() {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
