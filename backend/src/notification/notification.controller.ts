import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { NotificationQueryDto, NotificationType } from './dto/notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(
    @Request() req,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    query: NotificationQueryDto,
  ) {
    return this.notificationService.getUserNotifications(
      req.user.userId,
      query,
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.notificationService.getUnreadCount(req.user.userId);
  }

  @Get(':id')
  async getNotificationById(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationService.getNotificationById(req.user.userId, id);
  }

  @Get('type/:type')
  async getNotificationsByType(
    @Request() req,
    @Param('type') type: NotificationType,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take = 20,
  ) {
    return this.notificationService.getNotificationsByType(
      req.user.userId,
      type,
      skip,
      take,
    );
  }

  @Put(':id/read')
  async markAsRead(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.notificationService.markAsRead(req.user.userId, id);
  }

  @Put('mark-all-read')
  async markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  async deleteNotification(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationService.deleteNotification(req.user.userId, id);
  }

  @Delete()
  async clearAllNotifications(@Request() req) {
    return this.notificationService.clearAllNotifications(req.user.userId);
  }
}
