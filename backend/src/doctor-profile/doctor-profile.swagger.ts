import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

export const ApiTagsDoctors = ApiTags('Doctors');

/**
 * Get logged-in doctor profile
 */
export const ApiGetOwnProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get profile of the logged-in doctor (Doctor only)',
    }),
    ApiResponse({
      status: 200,
      description: "Returns the logged-in doctor's profile",
    }),
    ApiResponse({ status: 404, description: 'Doctor profile not found' }),
  );

/**
 * Get doctor profile by ID (public)
 */
export const ApiGetDoctorById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get doctor profile by ID (Public)' }),
    ApiParam({ name: 'id', description: 'Doctor User ID', type: Number }),
    ApiResponse({
      status: 200,
      description:
        'Returns the doctor profile for the given user ID with reviews and average rating',
    }),
    ApiResponse({ status: 404, description: 'Doctor profile not found' }),
  );

/**
 * Create empty doctor profile (Doctor only)
 */
export const ApiCreateEmptyProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create an empty doctor profile (Doctor only)' }),
    ApiResponse({
      status: 201,
      description: 'Empty doctor profile created successfully',
    }),
    ApiResponse({ status: 400, description: 'Doctor profile already exists' }),
    ApiResponse({ status: 401, description: 'User not found' }),
  );

/**
 * Update doctor profile (Doctor only)
 */
export const ApiUpdateProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update the logged-in doctor profile (Doctor only)',
    }),
    ApiResponse({
      status: 200,
      description: 'Doctor profile updated successfully',
    }),
    ApiResponse({
      status: 403,
      description: 'Only doctors can update their profile',
    }),
    ApiResponse({ status: 404, description: 'Doctor profile not found' }),
  );

/**
 * Delete doctor profile (Doctor only)
 */
export const ApiDeleteProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete the logged-in doctor profile (Doctor only)',
    }),
    ApiResponse({
      status: 200,
      description: 'Doctor profile deleted successfully',
    }),
    ApiResponse({
      status: 403,
      description: 'Only doctors can delete their profile',
    }),
    ApiResponse({ status: 404, description: 'Doctor profile not found' }),
  );
