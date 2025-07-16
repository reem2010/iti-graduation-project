import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { MessageDto } from './dto/message.dto';

export const ApiTagsMessages = ApiTags('Messages');

/**
 * Send a new message
 */
export const ApiCreateMessage = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Send a new message' }),
    ApiBody({ type: MessageDto }),
    ApiResponse({ status: 201, description: 'Message sent successfully' }),
    ApiResponse({
      status: 400,
      description: 'Missing required fields in message',
    }),
  );

/**
 * Get online status of a user by ID
 */
export const ApiGetUserStatus = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get user online status' }),
    ApiParam({ name: 'userId', type: String, description: 'User ID' }),
    ApiResponse({ status: 200, description: 'User status retrieved' }),
  );

/**
 * Get logged-in user's chat list
 */
export const ApiGetUserChats = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get logged-in user chat list' }),
    ApiResponse({ status: 200, description: 'Chat list retrieved' }),
  );

/**
 * Get unread messages between the logged-in user and a sender
 */
export const ApiGetUnreadMessages = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get unread messages from a specific sender' }),
    ApiParam({ name: 'senderId', type: String, description: 'Sender User ID' }),
    ApiResponse({ status: 200, description: 'Unread messages retrieved' }),
  );

/**
 * Get conversation between two users
 */
export const ApiGetConversation = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get conversation between two users' }),
    ApiParam({ name: 'senderId', type: String, description: 'Sender User ID' }),
    ApiParam({
      name: 'recipientId',
      type: String,
      description: 'Recipient User ID',
    }),
    ApiResponse({ status: 200, description: 'Conversation retrieved' }),
  );

/**
 * Get unread message count for logged-in user
 */
export const ApiGetUnreadCount = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get total unread messages count for logged-in user',
    }),
    ApiResponse({ status: 200, description: 'Unread count retrieved' }),
  );

/**
 * Clear unread messages from a sender for the logged-in user
 */
export const ApiClearUnreadMessages = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Clear unread messages from a sender' }),
    ApiParam({ name: 'senderId', type: String, description: 'Sender User ID' }),
    ApiResponse({ status: 200, description: 'Unread messages cleared' }),
  );
