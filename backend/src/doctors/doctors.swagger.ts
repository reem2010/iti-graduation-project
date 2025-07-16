import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

export const ApiTagsTherapists = ApiTags('Therapists');

export const ApiFindAllTherapists = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Retrieve all therapists with optional filters and pagination',
    }),

    ApiQuery({
      name: 'search',
      required: false,
      description: 'Search by first name, last name, or specialization',
      example: 'John',
    }),
    ApiQuery({
      name: 'language',
      required: false,
      description: 'Filter therapists by language',
      example: 'English',
    }),
    ApiQuery({
      name: 'gender',
      required: false,
      description: 'Filter by gender (e.g., male, female)',
      example: 'female',
    }),
    ApiQuery({
      name: 'isAcceptingNewPatients',
      required: false,
      description: 'Whether the therapist is accepting new patients',
      example: 'true',
    }),
    ApiQuery({
      name: 'minExperience',
      required: false,
      description: 'Minimum years of experience',
      example: '5',
    }),
    ApiQuery({
      name: 'maxFee',
      required: false,
      description: 'Maximum consultation fee',
      example: '100',
    }),

    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number for pagination',
      example: '1',
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of therapists per page',
      example: '6',
      type: Number,
    }),

    ApiResponse({
      status: 200,
      description: 'List of therapists retrieved successfully',
    }),
  );
