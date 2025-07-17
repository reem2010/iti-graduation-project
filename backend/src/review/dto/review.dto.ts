import {
  Max,
  Min,
  IsOptional,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsBoolean,
  IsString,
  IsNumber,
  IsPositive,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ReviewsDto {
  @ApiProperty({
    example: 4,
    minimum: 1,
    maximum: 5,
    description: 'Rating from 1 to 5',
  })
  @Min(1, { message: 'Rating from 1 to 5' })
  @Max(5, { message: 'Rating from 1 to 5' })
  rating: number;

  @ApiPropertyOptional({
    example: 'Great doctor and friendly staff.',
    description: 'Optional comment about the doctor',
  })
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Flag indicating if the review is anonymous',
  })
  @IsOptional()
  @IsBoolean({ message: 'isAnonymous must be a boolean value' })
  isAnonymous: boolean = false;
}

export class CreateReviewsDto extends ReviewsDto {
  @ApiProperty({
    example: 3,
    description: 'ID of the doctor being reviewed, must be a positive number',
  })
  @IsNotEmpty({ message: 'doctorId cannot be empty' })
  @IsNumber({}, { message: 'doctorId must be a number' })
  @IsPositive({ message: 'doctorId must be a positive number' })
  doctorId: number;
}

export class UpdateReviewsDto extends ReviewsDto {
  @ApiProperty({
    example: 7,
    description:
      'Review ID that needs to be updated, must be a positive number',
  })
  @IsNotEmpty({ message: 'Review id cannot be empty' })
  @IsNumber({}, { message: 'Review id must be a number' })
  @IsPositive({ message: 'Review id must be a positive number' })
  id: number;
}

export class ReportReviewsDto extends ReviewsDto {
  @ApiProperty({
    example: 'Contains inappropriate language',
    minLength: 3,
    maxLength: 1500,
    description:
      'Reason for reporting the review, between 3 and 1500 characters',
  })
  @IsNotEmpty({ message: 'reason cannot be empty' })
  @IsString({ message: 'reason must be a string' })
  @MinLength(3, {
    message: 'Report reason should be at least 3 characters long',
  })
  @MaxLength(1500, { message: 'Report reason cannot exceed 1500 characters' })
  reason: string;
}
