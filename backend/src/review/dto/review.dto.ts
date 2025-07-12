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
class ReviewsDto {
  @Min(1, { message: 'Rating from 1 to 5' })
  @Max(5, { message: 'Rating from 1 to 5' })
  rating: number;
  @IsOptional()
  comment?: string;
  @IsOptional()
  @IsBoolean({ message: 'isAnonymous must be a boolean value' })
  isAnonymous: boolean = false;
}
export class CreateReviewsDto extends ReviewsDto {
  @IsNotEmpty({ message: 'doctorId cannot be empty' })
  @IsNumber({}, { message: 'doctorId must be a number' })
  @IsPositive({ message: 'doctorId must be a positive number' })
  doctorId: number;
}
export class UpdateReviewsDto extends ReviewsDto {
  @IsNotEmpty({ message: 'Review id cannot be empty' })
  @IsNumber({}, { message: 'Review id must be a number' })
  @IsPositive({ message: 'Review id must be a positive number' })
  id: number;
}
export class ReportReviewsDto extends ReviewsDto {
  @IsNotEmpty({ message: 'reason cannot be empty' })
  @IsString({ message: 'reason must be a string' })
  @MinLength(3, {
    message: 'Report reason should be at least 3 characters long',
  })
  @MaxLength(1500, { message: 'Report reason cannot exceed 1500 characters' })
  reason: string;
}
