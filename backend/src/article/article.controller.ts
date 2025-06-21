/**
 * unregister can see all posts
 * only owner can update and delete his articale
 */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticlesService } from './article.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
@Controller('article')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}
  @Get('/')
  async findAll() {
    return this.articlesService.findAll();
  }
  @Get('/doctor/:id')
  async findAllByDoctorId(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.findAllByDoctorId(id);
  }
  @Get('/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.findById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: any,
  ) {
    if (req.role == 'patient') {
      return { message: 'Only Doctor can write articles' };
    }
    const doctorId = req.user.userId;
    return this.articlesService.create(createArticleDto, doctorId);
  }
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req: any,
  ) {
    if (req.role == 'patient') {
      return { message: 'Only Doctor can write articles' };
    }
    const doctorId = req.user.userId;
    return this.articlesService.update(id, updateArticleDto, doctorId);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    if (req.role == 'patient') {
      return { message: 'Only Doctor can write and delete articles' };
    }
    const doctorId = req.user.userId;
    return this.articlesService.remove(id, doctorId);
  }
}
