import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

export const ApiTagsPatient = ApiTags('Patients');

export const ApiGetPatientProfileById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get any patient profile by user ID' }),
    ApiParam({
      name: 'userId',
      description: 'The user ID of the patient',
      example: 5,
    }),
    ApiResponse({
      status: 200,
      description: 'Patient profile fetched successfully',
    }),
    ApiResponse({ status: 404, description: 'Patient profile does not exist' }),
  );

export const ApiGetOwnPatientProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Get logged-in patient's profile" }),
    ApiResponse({
      status: 200,
      description: 'Own patient profile fetched successfully',
    }),
    ApiResponse({ status: 404, description: 'Patient profile does not exist' }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Missing or invalid token',
    }),
  );

export const ApiCreatePatientProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a patient profile for the logged-in user',
    }),
    ApiResponse({
      status: 201,
      description: 'Patient profile created successfully',
    }),
    ApiResponse({ status: 400, description: 'Patient profile already exists' }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - User not found or not logged in',
    }),
  );

export const ApiUpdatePatientProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Update the logged-in patient's profile" }),
    ApiResponse({
      status: 200,
      description: 'Patient profile updated successfully',
    }),
    ApiResponse({
      status: 403,
      description: 'Only patients can update their profile',
    }),
    ApiResponse({ status: 404, description: 'Patient profile does not exist' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );

export const ApiDeletePatientProfile = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: "Delete the logged-in patient's profile" }),
    ApiResponse({
      status: 200,
      description: 'Patient profile deleted successfully',
    }),
    ApiResponse({
      status: 403,
      description: 'Only patients can delete their profile',
    }),
    ApiResponse({ status: 404, description: 'Patient profile does not exist' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
