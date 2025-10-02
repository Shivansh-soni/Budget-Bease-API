import { Module } from '@nestjs/common';
import { ExpenseService } from './service/expense.service';
import { ExpenseController } from './controller/expense.controller';
import { PrismaService } from '@/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@/modules/gaurds/AuthGaurd';

@Module({
  controllers: [ExpenseController],
  providers: [ExpenseService, PrismaService, JwtService, AuthGuard],
})
export class ExpenseModule {}
