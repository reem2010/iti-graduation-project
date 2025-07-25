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
import {
  ApiUpdateUser,
  ApiDeleteUser,
  ApiGetUser,
  ApiGetUserById,
} from './user.swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Put('')
  @ApiUpdateUser()
  updateUser(@Req() req, @Body() updateData: Partial<RegisterDto>) {
    return this.userService.updateUser(req.user.userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('')
  @ApiDeleteUser()
  delete(@Req() req) {
    return this.userService.deleteUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiGetUser()
  getUser(@Req() req) {
    return this.userService.getUser(req.user.userId);
  }
  @Get(':userId')
  @ApiGetUserById()
  getUserById(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getUser(userId);
  }
}
