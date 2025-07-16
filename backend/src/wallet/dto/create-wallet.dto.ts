import { IsInt, IsPositive, IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiPropertyOptional({
    description: 'User ID associated with the wallet',
    example: 15,
  })
  @IsOptional()
  @IsInt()
  userId: number;

  @ApiPropertyOptional({
    description: 'Initial balance of the wallet',
    example: 100.5,
    minimum: 0,
  })
  @IsOptional()
  @IsPositive()
  balance?: number;

  @ApiPropertyOptional({
    description: 'Currency of the wallet',
    example: 'EGP',
  })
  @IsOptional()
  @IsString()
  currency?: string;
}
