import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const ApiTagsArticle = ApiTags('Articles');

export const ApiGetAllArticles = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all articles (public)' }),
    ApiResponse({ status: 200, description: 'List of all articles' }),
  );

export const ApiGetAllByDoctor = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all articles by a specific doctor (public)' }),
    ApiParam({ name: 'id', description: 'Doctor ID', type: Number }),
    ApiResponse({
      status: 200,
      description: 'Articles by doctor retrieved successfully',
    }),
    ApiResponse({ status: 404, description: 'No articles found for doctor' }),
  );

export const ApiGetArticleById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get an article by its ID (public)' }),
    ApiParam({ name: 'id', description: 'Article ID', type: Number }),
    ApiResponse({ status: 200, description: 'Article retrieved successfully' }),
    ApiResponse({ status: 404, description: 'Article not found' }),
  );

export const ApiCreateArticle = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new article (Doctors only)' }),
    ApiResponse({ status: 201, description: 'Article created successfully' }),
    ApiResponse({
      status: 403,
      description: 'Only doctors can write articles',
    }),
  );

export const ApiUpdateArticle = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update an article (Only owner doctor)' }),
    ApiParam({ name: 'id', description: 'Article ID', type: Number }),
    ApiResponse({ status: 200, description: 'Article updated successfully' }),
    ApiResponse({
      status: 403,
      description: 'Update allowed only for article owner',
    }),
    ApiResponse({ status: 404, description: 'Article not found' }),
  );

export const ApiDeleteArticle = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete an article (Only owner doctor)' }),
    ApiParam({ name: 'id', description: 'Article ID', type: Number }),
    ApiResponse({ status: 200, description: 'Article deleted successfully' }),
    ApiResponse({
      status: 403,
      description: 'Delete articles allowed only for article owner',
    }),
    ApiResponse({ status: 404, description: 'Article not found' }),
  );
