import {
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ArticleDto {
  @ApiProperty({
    description: 'Content of the article',
    minLength: 10,
    maxLength: 6000,
    example: 'This is an example of a valid article content.',
  })
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(10, { message: 'Content too short' })
  @MaxLength(6000, { message: 'Content too long' })
  content: string;

  @ApiPropertyOptional({
    description: 'Optional media URL for the article',
    example: 'https://example.com/media.jpg',
  })
  @IsOptional()
  media?: string;
}

export class CreateArticleDto extends ArticleDto {}

export class UpdateArticleDto extends ArticleDto {}
