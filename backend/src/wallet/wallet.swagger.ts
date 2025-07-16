import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export const ApiTagsWallet = ApiTags('Wallet');

export const ApiCreateWallet = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a wallet for the logged-in user' }),
  );

export const ApiGetWallet = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get the wallet details of the logged-in user' }),
  );
