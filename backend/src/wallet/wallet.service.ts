import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { PrismaService } from 'prisma/prisma.service';
import { NotificationFacade } from '../notification/notification.facade';

@Injectable()
export class WalletService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationFacade: NotificationFacade,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    try {
      const wallet = await this.prisma.wallet.create({
        data: createWalletDto,
      });
      await this.notificationFacade.notifyWalletDeposit(createWalletDto.userId, createWalletDto.balance);
      return wallet;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Wallet already exists for this user.');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found.');
      }
      throw error;
    }
  }

  async findOne(userId: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet not found for user ID ${userId}`);
    }

    return wallet;
  }

  async pay(amount: number, userId: number) {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: { userId },
      });

      if (!wallet || wallet.balance.toNumber() < amount) {
        return false;
      }

      await this.prisma.wallet.update({
        where: { userId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
      return true;
    } catch (error) {
      console.error('Wallet payment error:', error);
      return false;
    }
  }

  async refund(amount: number, userId: number) {
    const wallet = await this.prisma.wallet.upsert({
      where: { userId },
      update: {
        balance: {
          increment: amount,
        },
      },
      create: {
        userId,
        balance: amount,
      },
    });
    await this.notificationFacade.notifyWalletDeposit(userId, amount);
    return wallet;
  }
}
