import { Module } from '@nestjs/common';
import { ExpenseService } from './service/expense.service';
import { ExpenseController } from './controller/expense.controller';
import { PrismaService } from '../../../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Module({
  controllers: [ExpenseController],
  providers: [ExpenseService, PrismaService, JwtService, JwtAuthGuard],
})
export class ExpenseModule {}
