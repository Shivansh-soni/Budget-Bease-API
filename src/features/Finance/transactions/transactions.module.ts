import { Logger, Module } from '@nestjs/common';
import { TransactionsService } from './service/transactions.service';
import { TransactionsController } from './controller/transactions.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@/features/auth/guards/jwt-auth.guard';
import { PrismaService } from '@/prisma.service';
import { SavingsService } from '../savings/service/savings.service';
import { CategoriesService } from '../categories/service/categories.service';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    JwtService,
    JwtAuthGuard,
    PrismaService,
    CategoriesService,
    SavingsService,
    Logger,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
