import { Module } from '@nestjs/common';
import { SavingsService } from './service/savings.service';
import { SavingsController } from './controller/savings.controller';
import { PrismaService } from '@/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@/modules/gaurds/AuthGaurd';

@Module({
  controllers: [SavingsController],
  providers: [SavingsService, PrismaService, JwtService, AuthGuard],
})
export class SavingsModule {}
