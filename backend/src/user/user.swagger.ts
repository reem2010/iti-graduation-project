import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

export const ApiUpdateUser = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update current authenticated user' }),
    ApiResponse({ status: 200, description: 'User updated successfully' }),
  );

export const ApiDeleteUser = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete current authenticated user' }),
    ApiResponse({ status: 200, description: 'User deleted successfully' }),
  );

export const ApiGetUser = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get current authenticated user' }),
    ApiResponse({ status: 200, description: 'Fetched user data' }),
  );

export const ApiGetUserById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get user by ID' }),
    ApiParam({ name: 'userId', type: Number, description: 'User ID' }),
    ApiResponse({ status: 200, description: 'Fetched user by ID' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
