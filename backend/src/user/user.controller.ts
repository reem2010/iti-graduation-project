import {
  Controller,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Put('')
  update(@Req() req, @Body() updateData: Partial<RegisterDto>) {
    const userId = req.user.userId;
    return this.userService.updateUser(userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('')
  delete(@Req() req) {
    return this.userService.deleteUser(req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('')
  getUser(@Req() req) {
    return this.userService.getUser(req.user.userId);
  }
  @Get(':userId')
  getUserById(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getUser(userId);
  }
}
