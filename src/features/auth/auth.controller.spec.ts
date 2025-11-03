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

      const result = await controller.register(createAuthDto);

      expect(authService.create).toHaveBeenCalledWith(createAuthDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if registration fails', async () => {
      const error = new BadRequestException('Registration failed');
      mockAuthService.create.mockRejectedValue(error);

      await expect(controller.register(createAuthDto)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    const mockRequest = {
      user: {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      }
    };

    it('should call authService.login with the correct parameters', async () => {
      const expectedResult = { access_token: 'test-token' };
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(mockRequest);

      expect(authService.login).toHaveBeenCalledWith(mockRequest.user);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if login fails', async () => {
      const error = new UnauthorizedException('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);
      const mockRequest = {
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
        }
      };

      await expect(controller.login(mockRequest)).rejects.toThrow(error);
    });
  });

  describe('getProfile', () => {
    const mockRequest = {
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      }
    };
    const userData = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    it('should return the user profile from the request', async () => {
      // getProfile method just returns req.user, so no need to mock authService.findOne
      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(mockRequest.user);
    });

    // Note: Since getProfile just returns req.user directly (without calling authService.findOne), 
    // there's no scenario where it would call authService.findOne to throw an error.
    // The original test was incorrect for this method.
  });
});
