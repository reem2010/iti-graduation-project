// src/reports/reports.swagger.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

export function SwaggerTags() {
  return ApiTags('Reports');
}

export function SwaggerAuth() {
  return ApiBearerAuth();
}

export function SwaggerUpdateReport() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Update diagnosis, prescription, notes, and documents for an appointment',
    }),
    ApiParam({ name: 'id', type: Number, description: 'Appointment ID' }),
    ApiResponse({
      status: 200,
      description: 'Appointment report updated successfully',
    }),
  );
}

export function SwaggerGetPatientsReports() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Fetch doctor’s patients with their reports (diagnosis, prescription, notes, documents)',
    }),
    ApiResponse({ status: 200, description: 'List of patients with reports' }),
  );
}
