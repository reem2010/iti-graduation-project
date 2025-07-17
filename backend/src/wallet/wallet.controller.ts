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
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ApiTagsWallet, ApiCreateWallet, ApiGetWallet } from './wallet.swagger';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreateWallet()
  create(@Body() createWalletDto: CreateWalletDto, @Request() req: any) {
    return this.walletService.create({
      ...createWalletDto,
      userId: req.user.userId,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiGetWallet()
  findOne(@Request() req: any) {
    return this.walletService.findOne(req.user.userId);
  }
}
