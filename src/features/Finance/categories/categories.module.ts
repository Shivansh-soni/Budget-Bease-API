import { Module } from '@nestjs/common';
import { CategoriesService } from './service/categories.service';
import { CategoriesController } from './controller/categories.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma.service';
import { JwtAuthGuard } from '@/features/auth/guards/jwt-auth.guard';
import { JwtStrategy } from '@/features/auth/strategies/jwt.strategy';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    JwtAuthGuard,
    JwtStrategy,
    JwtService,
    PrismaService,
  ],
})
export class CategoriesModule {}
