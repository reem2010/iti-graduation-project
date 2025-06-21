import {
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from '@nestjs/class-validator';
class ArticleDto {
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(10, { message: 'Content too short' })
  @MaxLength(6000, { message: 'Content too long' })
  content: string;
  @IsOptional()
  media?: string;
}
export class CreateArticleDto extends ArticleDto {}
export class UpdateArticleDto extends ArticleDto {}
