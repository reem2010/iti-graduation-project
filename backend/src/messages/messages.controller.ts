import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageDto } from './dto/message.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createMessageDto: MessageDto, @Request() req: any) {
    return this.messagesService.create(createMessageDto, req.user.userId);
  }

  @Get('user-status/:userId')
  getUserStatus(@Param('userId') userId: string) {
    return this.messagesService.getUserStatus(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread/:senderId')
  getUnreadMessages(@Request() req: any, @Param('senderId') senderId: string) {
    return this.messagesService.getUnreadMessages(req.user.userId, senderId);
  }

  @Get(':senderId/:recipientId')
  getConversation(
    @Param('senderId') senderId: string,
    @Param('recipientId') recipientId: string,
  ) {
    return this.messagesService.getConversation(+senderId, +recipientId);
  }

  //   @Patch('markAsRead/:senderId/:recipientId')
  //   markAsRead(
  //     @Param('senderId') senderId: string,
  //     @Param('recipientId') recipientId: string,
  //   ) {
  //     return this.messagesService.markMessagesAsRead(+senderId, +recipientId);
  //   }

  @UseGuards(JwtAuthGuard)
  @Patch('unread/clear/:senderId')
  clearUnread(@Param('senderId') senderId: string, @Request() req: any) {
    return this.messagesService.clearUnreadMessages(req.user.userId, senderId);
  }
}
