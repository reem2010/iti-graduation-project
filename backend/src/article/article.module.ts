import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ArticlesController } from './article.controller';
import { ArticlesService } from './article.service';

@Module({
  imports: [AuthModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModel {}
