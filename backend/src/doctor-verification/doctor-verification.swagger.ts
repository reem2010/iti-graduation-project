import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

export const ApiTagsDoctorVerification = ApiTags('Doctor Verification');

/**
 * Get the logged-in doctor's verification data
 */
export const ApiGetOwnVerification = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get logged-in doctor verification info' }),
    ApiResponse({
      status: 200,
      description: 'Returns doctor verification details for logged-in doctor',
    }),
    ApiResponse({ status: 404, description: 'Doctor verification not found' }),
  );

/**
 * Get verification info of a specific doctor by their ID
 */
export const ApiGetVerificationByDoctorId = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get verification info of a specific doctor by their User ID',
    }),
    ApiParam({ name: 'doctorId', type: Number, description: 'Doctor User ID' }),
    ApiResponse({
      status: 200,
      description: 'Returns the verification details of the specified doctor',
    }),
    ApiResponse({ status: 404, description: 'Doctor verification not found' }),
  );

/**
 * Create default verification record for doctor
 */
export const ApiCreateVerification = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create default doctor verification (Doctors only)',
    }),
    ApiResponse({
      status: 201,
      description: 'Default doctor verification created successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Verification already exists',
    }),
    ApiResponse({
      status: 403,
      description: 'Only doctors can have a verification record',
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
  );

/**
 * Update logged-in doctor's verification details
 */
export const ApiUpdateVerification = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update doctor verification details (Doctors only)',
    }),
    ApiResponse({
      status: 200,
      description: 'Doctor verification updated successfully',
    }),
    ApiResponse({
      status: 403,
      description: 'Only doctors can update verification',
    }),
    ApiResponse({
      status: 404,
      description: 'Verification does not exist',
    }),
  );

/**
 * Delete logged-in doctor's verification
 */
export const ApiDeleteVerification = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete doctor verification (Doctors only)' }),
    ApiResponse({
      status: 200,
      description: 'Doctor verification deleted successfully',
    }),
    ApiResponse({
      status: 403,
      description: 'Only doctors can delete verification',
    }),
    ApiResponse({
      status: 404,
      description: 'Verification does not exist',
    }),
  );

/**
 * Admin reviewing doctor verification
 */
export const ApiReviewVerification = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Admin review of doctor verification' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Doctor verification ID',
    }),
    ApiResponse({
      status: 200,
      description: 'Doctor verification reviewed successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Verification is not pending or rejection reason missing',
    }),
    ApiResponse({
      status: 403,
      description: 'Only admins can review verification requests',
    }),
    ApiResponse({
      status: 404,
      description: 'Verification not found',
    }),
  );
