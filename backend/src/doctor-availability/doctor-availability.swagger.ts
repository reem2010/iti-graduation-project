import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiGetDoctorAvailabilities = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get availabilities for  doctor' }),
    ApiResponse({ status: 200, description: 'List of doctor availabilities.' }),
  );

export const ApiGetAvailabilityByDoctorId = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get availability by doctor ID' }),
    ApiParam({ name: 'doctorId', type: Number, description: 'Doctor ID' }),
    ApiResponse({
      status: 200,
      description: 'Availability for the specified doctor.',
    }),
  );

export const ApiCreateEmptyAvailability = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create an empty availability for the authenticated doctor',
    }),
    ApiResponse({ status: 201, description: 'Empty availability created.' }),
  );

export const ApiAddDoctorAvailability = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add new doctor availability' }),
    ApiResponse({ status: 201, description: 'Doctor availability added.' }),
  );

export const ApiUpdateDoctorAvailability = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update doctor availability by ID' }),
    ApiParam({ name: 'id', type: Number, description: 'Availability ID' }),
    ApiResponse({ status: 200, description: 'Doctor availability updated.' }),
  );

export const ApiDeleteDoctorAvailability = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete doctor availability by ID' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Availability ID to delete',
    }),
    ApiResponse({ status: 200, description: 'Doctor availability deleted.' }),
  );

export const ApiGetWeeklySlots = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get weekly available slots for a doctor (next 7 days)',
    }),
    ApiParam({ name: 'doctorId', type: Number, description: 'Doctor ID' }),
    ApiResponse({ status: 200, description: 'List of available slots.' }),
  );
