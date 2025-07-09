// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUser(id: number, updateData: Partial<RegisterDto>) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const dataToUpdate: any = { ...updateData };

    if (updateData.password) {
      const passwordHash = await bcrypt.hash(updateData.password, 10);
      dataToUpdate.passwordHash = passwordHash;
      delete dataToUpdate.password; // Remove plaintext password
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    return {
      message: 'User updated successfully',
      data: updatedUser,
    };
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
