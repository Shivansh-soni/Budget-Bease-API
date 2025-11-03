import { Test, TestingModule } from '@nestjs/testing';
import { SavingsService } from './savings.service';
import { PrismaService } from '../../../../prisma.service';

describe('SavingsService', () => {
  let service: SavingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavingsService, PrismaService],
    }).compile();

    service = module.get<SavingsService>(SavingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
