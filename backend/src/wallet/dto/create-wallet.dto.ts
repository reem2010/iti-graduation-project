import { IsInt, IsPositive, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateWalletDto {
  @IsOptional()
  @IsInt()
  userId: number;

  @IsOptional()
  @IsPositive()
  balance?: number;

  @IsOptional()
  @IsString()
  @IsIn(['USD', 'EGP', 'EUR'])
  currency?: string;
}
