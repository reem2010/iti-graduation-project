// src/user/user.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  updateUser(userId: number, updateData: Partial<RegisterDto>) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async deleteUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id: userId } });

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
