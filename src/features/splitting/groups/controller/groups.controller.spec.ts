import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GroupsController } from './groups.controller';
import { GroupsService } from '../service/groups.service';
import { PrismaService } from '../../../../prisma.service';

// Mock AuthGuard
const mockAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 1, email: 'test@example.com' };
    return true;
  },
};

describe('GroupsController', () => {
  let controller: GroupsController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        GroupsService,
        {
          provide: PrismaService,
          useValue: {
            group: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
            sign: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard('AuthGuard')
    .useValue(mockAuthGuard)
    .compile();

    controller = module.get<GroupsController>(GroupsController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(prismaService).toBeDefined();
  });
});
