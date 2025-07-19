// src/user/user.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';
import { NotificationFacade } from '../notification/notification.facade';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationFacade: NotificationFacade,
  ) {}

  async updateUser(userId: number, updateData: Partial<RegisterDto>) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    await this.notificationFacade.notifyUserUpdated(userId);
    return updatedUser;
  }

  async deleteUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id: userId } });
    await this.notificationFacade.notifyUserDeleted(userId);
    return { message: 'User deleted successfully' };
  }

  async getUser(userId: number) {
    console.log('Fetching /user with ID:', userId);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    console.log('User ID:', userId);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  getUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
