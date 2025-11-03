import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../../../prisma.service';
import { CategoriesService } from '../../categories/service/categories.service';
import { SavingsService } from '../../savings/service/savings.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prismaService: PrismaService;
  let categoriesService: CategoriesService;
  let savingsService: SavingsService;

  const mockPrismaService = {
    transaction: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCategoriesService = {
    findOne: jest.fn(),
  };

  const mockSavingsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
        {
          provide: SavingsService,
          useValue: mockSavingsService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prismaService = module.get<PrismaService>(PrismaService);
    categoriesService = module.get<CategoriesService>(CategoriesService);
    savingsService = module.get<SavingsService>(SavingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(categoriesService).toBeDefined();
    expect(savingsService).toBeDefined();
  });
});
