import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [JwtModule, NotificationModule],
  providers: [UserService, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
