import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateReviewsDto, UpdateReviewsDto } from './dto/review.dto';

export function ApiReviewTags() {
  return applyDecorators(ApiTags('Review'), ApiBearerAuth());
}

export function ApiFindAllByDoctorId() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all reviews for a specific doctor' }),
    ApiParam({ name: 'id', type: Number, description: 'Doctor ID' }),
    ApiResponse({ status: 200, description: 'List of reviews for the doctor' }),
    ApiResponse({ status: 400, description: 'Invalid doctor ID' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function ApiCreateReview() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new review for a doctor' }),
    ApiBody({ type: CreateReviewsDto }),
    ApiResponse({ status: 201, description: 'Review created successfully' }),
    ApiResponse({ status: 403, description: 'Review only for patient' }),
    ApiResponse({ status: 404, description: 'Patient or Doctor not found' }),
    ApiResponse({ status: 409, description: 'Already reviewed this doctor' }),
  );
}

export function ApiUpdateReview() {
  return applyDecorators(
    ApiOperation({ summary: 'Update an existing review' }),
    ApiBody({ type: UpdateReviewsDto }),
    ApiResponse({ status: 200, description: 'Review updated successfully' }),
    ApiResponse({
      status: 403,
      description: "Update allowed only for review's writer",
    }),
    ApiResponse({ status: 404, description: 'Review not found' }),
  );
}
