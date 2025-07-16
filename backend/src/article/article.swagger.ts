import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const ApiGetAllArticles = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all articles (public)' }),
    ApiResponse({ status: 200, description: 'List of all articles.' }),
  );

export const ApiGetAllByDoctor = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all articles by a specific doctor (public)' }),
    ApiParam({ name: 'id', description: 'Doctor ID', type: Number }),
    ApiResponse({
      status: 200,
      description: 'List of articles by the specified doctor.',
    }),
  );

export const ApiGetArticleById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get an article by its ID (public)' }),
    ApiParam({ name: 'id', description: 'Article ID', type: Number }),
    ApiResponse({ status: 200, description: 'Article details.' }),
  );

export const ApiCreateArticle = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new article (Doctors only)' }),
    ApiResponse({ status: 201, description: 'Article created successfully.' }),
  );

export const ApiUpdateArticle = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update an article (Only owner doctor)' }),
    ApiParam({ name: 'id', description: 'Article ID', type: Number }),
    ApiResponse({ status: 200, description: 'Article updated successfully.' }),
  );

export const ApiDeleteArticle = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete an article (Only owner doctor)' }),
    ApiParam({ name: 'id', description: 'Article ID', type: Number }),
    ApiResponse({ status: 200, description: 'Article deleted successfully.' }),
  );
