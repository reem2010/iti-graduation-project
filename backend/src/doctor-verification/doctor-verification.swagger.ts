import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

export const ApiTagsDoctorVerification = ApiTags('Doctor Verification');

export const ApiGetOwnVerification = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get logged-in doctor verification info' }),
    ApiResponse({
      status: 200,
      description: 'Returns doctor verification details for logged-in doctor',
    }),
  );

export const ApiGetVerificationByDoctorId = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get verification info of a specific doctor by ID',
    }),
    ApiParam({ name: 'doctorId', type: Number, description: 'Doctor ID' }),
    ApiResponse({
      status: 200,
      description: 'Returns the verification details of the specified doctor',
    }),
  );

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
  );

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
  );

export const ApiDeleteVerification = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete doctor verification (Doctors only)' }),
    ApiResponse({
      status: 200,
      description: 'Doctor verification deleted successfully',
    }),
  );

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
  );
