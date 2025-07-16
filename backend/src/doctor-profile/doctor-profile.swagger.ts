import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

export const ApiTagsDoctors = ApiTags('Doctors');

export const ApiGetOwnProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get logged-in doctor profile' }),
    ApiResponse({
      status: 200,
      description: "Returns the logged-in doctor's profile",
    }),
  );

export const ApiGetDoctorById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get doctor profile by ID' }),
    ApiParam({ name: 'id', description: 'Doctor ID', type: Number }),
    ApiResponse({
      status: 200,
      description: 'Returns the doctor profile for the given ID',
    }),
  );

export const ApiCreateEmptyProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create an empty doctor profile (Doctors only)' }),
    ApiResponse({ status: 201, description: 'Empty doctor profile created' }),
  );

export const ApiUpdateProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update doctor profile (Doctors only)' }),
    ApiResponse({
      status: 200,
      description: 'Doctor profile updated successfully',
    }),
  );

export const ApiDeleteProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete doctor profile (Doctors only)' }),
    ApiResponse({
      status: 200,
      description: 'Doctor profile deleted successfully',
    }),
  );
