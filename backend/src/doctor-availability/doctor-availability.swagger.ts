import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateDoctorAvailabilityDto } from './dto/create-doctor-availability.dto';
import { UpdateDoctorAvailabilityDto } from './dto/update-doctor-availability.dto';

/**
 * Fetches all availabilities for the logged-in doctor.
 */
export const ApiGetDoctorAvailabilities = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Fetch all availabilities for the logged-in doctor',
    }),
    ApiResponse({
      status: 200,
      description:
        'Returns a list of all availability records for the authenticated doctor.',
    }),
    ApiResponse({ status: 404, description: 'No availability records found.' }),
  );

/**
 * Retrieves availability schedule for a specific doctor by ID.
 */
export const ApiGetAvailabilityByDoctorId = () =>
  applyDecorators(
    ApiOperation({ summary: 'Retrieve availability by doctor ID' }),
    ApiParam({
      name: 'doctorId',
      type: Number,
      description: 'ID of the doctor to fetch availability for.',
    }),
    ApiResponse({
      status: 200,
      description: 'Returns availability slots for the specified doctor.',
    }),
  );

/**
 * Creates an empty availability record for the authenticated doctor.
 */
export const ApiCreateEmptyAvailability = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create an empty availability for the authenticated doctor',
      description:
        'Initializes an availability record with placeholder data if none exists.',
    }),
    ApiResponse({
      status: 201,
      description: 'Empty availability record created.',
    }),
    ApiResponse({
      status: 400,
      description: 'Doctor profile must exist before setting availability.',
    }),
    ApiResponse({
      status: 403,
      description: 'Only doctors can have availability.',
    }),
  );

/**
 * Adds a new availability slot for the authenticated doctor.
 */
export const ApiAddDoctorAvailability = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Add new availability slot for the doctor' }),
    ApiBody({ type: CreateDoctorAvailabilityDto }),
    ApiResponse({
      status: 201,
      description: 'Doctor availability added successfully.',
    }),
    ApiResponse({
      status: 403,
      description: 'Only doctors can create availability.',
    }),
  );

/**
 * Updates an existing availability record by its ID.
 */
export const ApiUpdateDoctorAvailability = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update existing doctor availability by ID' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The ID of the availability record to update.',
    }),
    ApiBody({ type: UpdateDoctorAvailabilityDto }),
    ApiResponse({
      status: 200,
      description: 'Doctor availability updated successfully.',
    }),
    ApiResponse({
      status: 403,
      description: 'Only doctors can update availability.',
    }),
    ApiResponse({ status: 404, description: 'Availability record not found.' }),
  );

/**
 * Deletes a doctor availability record by its ID.
 */
export const ApiDeleteDoctorAvailability = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete doctor availability by ID' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The ID of the availability record to delete.',
    }),
    ApiResponse({
      status: 200,
      description: 'Doctor availability deleted successfully.',
    }),
    ApiResponse({
      status: 403,
      description: 'Only doctors can delete availability.',
    }),
    ApiResponse({ status: 404, description: 'Availability record not found.' }),
  );

/**
 * Fetches available slots for a doctor for the next 7 days.
 */
export const ApiGetWeeklySlots = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Fetch weekly available slots for a doctor (next 7 days)',
      description:
        'Returns available time slots for the next 7 days for the specified doctor, excluding already booked appointments.',
    }),
    ApiParam({
      name: 'doctorId',
      type: Number,
      description: 'ID of the doctor to fetch slots for.',
    }),
    ApiResponse({
      status: 200,
      description: 'List of available time slots retrieved successfully.',
    }),
    ApiResponse({ status: 400, description: 'Invalid doctorId provided.' }),
  );
