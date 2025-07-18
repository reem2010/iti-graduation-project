import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

/**
 * Apply general swagger tags to the controller
 */
export function PaymentControllerDocs() {
  return applyDecorators(ApiTags('Payment'));
}

/**
 * Swagger docs for retrieving all transactions (admin/public access)
 */
export function GetAllTransactionsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get All Transactions',
      description:
        'Retrieve all transactions. Accessible publicly or by admins.',
    }),
  );
}

/**
 * Swagger docs for retrieving the logged-in user's transactions
 */
export function GetUserTransactionsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get My Transactions',
      description:
        'Retrieve transactions for the currently authenticated user.',
    }),
  );
}
