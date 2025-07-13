import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createWalletDto: CreateWalletDto, @Request() req: any) {
    return this.walletService.create({
      ...createWalletDto,
      userId: req.user.userId,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@Request() req: any) {
    return this.walletService.findOne(req.user.userId);
  }
}
