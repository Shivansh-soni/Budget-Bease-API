import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from '../service/expense.service';
import { PrismaService } from '../../../../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../../../../../src/features/auth/guards/jwt-auth.guard';

describe('ExpenseController', () => {
  let controller: ExpenseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [ExpenseService, PrismaService, JwtService, JwtAuthGuard],
    }).compile();

    controller = module.get<ExpenseController>(ExpenseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
