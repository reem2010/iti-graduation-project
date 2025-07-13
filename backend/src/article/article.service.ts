import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}
  //1-Get All articles
  async findAll() {
    const articles = await this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        doctorProfile: {
          select: {
            yearsOfExperience: true,
            specialization: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
    if (!articles) {
      return [];
    }
    return articles;
  }
  //2-Get Article by id
  async findById(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        doctorProfile: {
          select: {
            yearsOfExperience: true,
            specialization: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }
  //3-Get article for specifec Doctor
  async findAllByDoctorId(doctorId: number) {
    const where: any = {
      doctorId: doctorId,
    };
    const articles = await this.prisma.article.findMany({
      where,
      include: {
        doctorProfile: {
          select: {
            yearsOfExperience: true,
            specialization: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
    if (!articles) {
      throw new NotFoundException('No Articles found for doctor');
    }
    return articles;
  }
  //4-Create article
  async create(article: CreateArticleDto, doctorId: number) {
    const { content, media } = article;
    const newArticle = await this.prisma.article.create({
      data: {
        content,
        doctorId,
        media,
      },
      include: {
        doctorProfile: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
    return newArticle;
  }
  //5-Update artile
  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    doctorId: number,
  ) {
    const foundedArticle = await this.prisma.article.findUnique({
      where: { id },
    });
    if (!foundedArticle) {
      throw new NotFoundException('Article not found');
    }
    if (foundedArticle.doctorId != doctorId) {
      throw new ForbiddenException('Update allowed only for article owner');
    }
    const updatdArticle = await this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
    return updatdArticle;
  }
  //6-Delete article
  async remove(id: number, doctorId: number) {
    const foundedArticle = await this.prisma.article.findUnique({
      where: { id },
    });
    if (!foundedArticle) {
      throw new NotFoundException('Article not found');
    }
    if (foundedArticle.doctorId != doctorId) {
      throw new ForbiddenException(
        'Delete articles allowed only for article owner',
      );
    }
    await this.prisma.article.delete({ where: { id } });
    return { message: 'Article deleted successfuly' };
  }
}
