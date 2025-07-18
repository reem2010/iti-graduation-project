import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ArticlesController } from './article.controller';
import { ArticlesService } from './article.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [AuthModule, NotificationModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModel {}
