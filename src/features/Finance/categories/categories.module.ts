import { Module } from '@nestjs/common';
import { CategoriesService } from './service/categories.service';
import { CategoriesController } from './controller/categories.controller';
import { AuthGuard } from '../../../modules/gaurds/AuthGaurd';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, AuthGuard, JwtService, PrismaService],
})
export class CategoriesModule {}
