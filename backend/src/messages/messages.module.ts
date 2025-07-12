import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { PrismaModule } from 'prisma/prisma.module';
import { MessagesGateway } from './messages.gateway';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [MessagesController],
  providers: [MessagesService, PrismaService, MessagesGateway]
})
export class MessagesModule {}
