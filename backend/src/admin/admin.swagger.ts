import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { AppointmentStatus, TransactionStatus } from '@prisma/client';

export function GetDoctorsSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve doctors with optional filters' }),
    ApiQuery({
      name: 'skip',
      required: false,
      description: 'Number of records to skip',
    }),
    ApiQuery({
      name: 'take',
      required: false,
      description: 'Number of records to take',
    }),
    ApiQuery({
      name: 'isActive',
      required: false,
      description: 'Filter by active status (true/false)',
    }),
    ApiQuery({
      name: 'isVerified',
      required: false,
      description: 'Filter by verification status (true/false)',
    }),
  );
}

export function UpdateDoctorStatusSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Update doctor status by ID' }),
    ApiParam({ name: 'id', type: Number, description: 'Doctor ID' }),
    ApiBody({
      description: 'Doctor status update body',
      schema: {
        type: 'object',
        properties: {
          isVerified: { type: 'boolean', example: true },
          isActive: { type: 'boolean', example: false },
        },
      },
    }),
  );
}

export function GetTransactionsSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve transactions with optional filters' }),
    ApiQuery({
      name: 'skip',
      required: false,
      description: 'Number of records to skip',
    }),
    ApiQuery({
      name: 'take',
      required: false,
      description: 'Number of records to take',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filter by transaction status',
      enum: TransactionStatus,
    }),
  );
}

export function GetAppointmentsSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve appointments with optional filters' }),
    ApiQuery({
      name: 'skip',
      required: false,
      description: 'Number of records to skip',
    }),
    ApiQuery({
      name: 'take',
      required: false,
      description: 'Number of records to take',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Filter by appointment status',
      enum: AppointmentStatus,
    }),
  );
}
