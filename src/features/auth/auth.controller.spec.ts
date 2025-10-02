import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    create: jest.fn(),
    login: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('healthCheck', () => {
  //   it('should return health check status', () => {
  //     const result = controller.healthCheck();

  //     expect(result).toHaveProperty('status', 'ok');
  //     expect(result).toHaveProperty('message', 'Budget Beast is running');
  //     expect(result).toHaveProperty('uptime');
  //     expect(typeof result.uptime).toBe('number');
  //   });
  // });

  describe('register', () => {
    const createAuthDto: CreateAuthDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User',
      DOB: new Date('1990-01-01').toISOString(),
    };

    it('should call authService.create with the correct parameters', async () => {
      const expectedResult = { id: 1, ...createAuthDto, password: undefined };
      mockAuthService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createAuthDto);

      expect(authService.create).toHaveBeenCalledWith(createAuthDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if registration fails', async () => {
      const error = new BadRequestException('Registration failed');
      mockAuthService.create.mockRejectedValue(error);

      await expect(controller.create(createAuthDto)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      username: '',
      password: 'password123',
    };

    it('should call authService.login with the correct parameters', async () => {
      const expectedResult = { access_token: 'test-token' };
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if login fails', async () => {
      const error = new UnauthorizedException('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    const userId = '1';
    const userData = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    it('should call authService.findOne with the correct id', async () => {
      mockAuthService.findOne.mockResolvedValue(userData);

      const result = await controller.findOne(userId);

      expect(authService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(userData);
    });

    it('should throw an error if user is not found', async () => {
      const error = new BadRequestException('User not found');
      mockAuthService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(userId)).rejects.toThrow(error);
    });
  });
});
