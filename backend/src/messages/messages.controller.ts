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
import {
  ApiTagsMessages,
  ApiCreateMessage,
  ApiGetUserStatus,
  ApiGetUserChats,
  ApiGetUnreadMessages,
  ApiGetConversation,
  ApiGetUnreadCount,
  ApiClearUnreadMessages,
} from './message.swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreateMessage()
  create(@Body() createMessageDto: MessageDto, @Request() req: any) {
    return this.messagesService.create(createMessageDto, req.user.userId);
  }

  @Get('user-status/:userId')
  @ApiGetUserStatus()
  getUserStatus(@Param('userId') userId: string) {
    return this.messagesService.getUserStatus(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiGetUserChats()
  async getUserChats(@Request() req: any) {
    return this.messagesService.getChatList(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread/:senderId')
  @ApiGetUnreadMessages()
  getUnreadMessages(@Request() req: any, @Param('senderId') senderId: string) {
    return this.messagesService.getUnreadMessages(req.user.userId, senderId);
  }

  @Get(':senderId/:recipientId')
  @ApiGetConversation()
  getConversation(
    @Param('senderId') senderId: string,
    @Param('recipientId') recipientId: string,
  ) {
    return this.messagesService.getConversation(+senderId, +recipientId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('unreadCount')
  @ApiGetUnreadCount()
  getUnreadCount(@Request() req: any) {
    return this.messagesService.getUnreadCount(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('unread/clear/:senderId')
  @ApiClearUnreadMessages()
  clearUnread(@Param('senderId') senderId: string, @Request() req: any) {
    return this.messagesService.clearUnreadMessages(req.user.userId, senderId);
  }
}
