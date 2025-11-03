import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { ExecutionContext } from '@nestjs/common';
import { LocalAuthGuard } from '../../../src/features/auth/guards/local-auth.guard';

import { AuthModule } from '../../../src/features/auth/auth.module';
import { AuthService } from '../../../src/features/auth/auth.service';
import { AuthController } from '../../../src/features/auth/auth.controller';
import { JwtStrategy } from '../../../src/features/auth/strategies/jwt.strategy';
import { LocalStrategy } from '../../../src/features/auth/strategies/local.strategy';
import { UsersService } from '../../../src/features/users/users.service';
import { PrismaService } from '../../../src/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  interface TestUser {
    id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    username: string;
    role: string;
    DOB: string;
    created_at: Date;
    updated_at: Date;
  }

  const testUser = {
    id: 1,
    email: 'test@example.com',
    password: 'Test@1234',
    first_name: 'Test',
    last_name: 'User',
    username: 'testuser',
    role: 'USER',
    DOB: '1990-01-01',
    created_at: new Date(),
    updated_at: new Date()
  };

  beforeAll(async () => {
    // Mock UsersService
    const mockUsersService = {
      create: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '15m' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
      controllers: [AuthController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get services from the app
    authService = moduleFixture.get<AuthService>(AuthService);
    usersService = moduleFixture.get<UsersService>(UsersService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    // Reset mocks before each test
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should register a new user', async () => {
      const registerPayload = {
        email: 'newuser@example.com',
        password: testUser.password,
        first_name: testUser.first_name,
        last_name: testUser.last_name,
        username: 'newuser',
        DOB: testUser.DOB,
        role: 'USER' // Add role to match the actual implementation
      };

      // Mock the create response from usersService
      const createdUser = {
        ...registerPayload,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        password: 'hashed_password',
        role: 'USER'
      };

      // Mock the usersService.create method
      (usersService.create as jest.Mock).mockResolvedValueOnce(createdUser);

      // Mock JWT signing
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('test-access-token');
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('test-refresh-token');

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerPayload)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user).toHaveProperty('email', registerPayload.email);
      
      // Verify usersService.create was called with the correct data
      const createCall = (usersService.create as jest.Mock).mock.calls[0][0];
      expect(createCall).toMatchObject({
        email: registerPayload.email,
        first_name: registerPayload.first_name,
        last_name: registerPayload.last_name,
        username: registerPayload.username,
        DOB: registerPayload.DOB,
        role: registerPayload.role
      });
      // Verify password was hashed (starts with $2b$)
      expect(createCall.password).toMatch(/^\$2b\$/);
    });

    it('should not register with duplicate email', async () => {
      // Create a Prisma error object
      const prismaError = {
        name: 'PrismaClientKnownRequestError',
        code: 'P2002',
        meta: { target: ['email'] },
        message: 'Unique constraint failed on the email'
      };
      
      (usersService.create as jest.Mock).mockRejectedValueOnce(prismaError);

      // Try to register with duplicate email
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123',
          first_name: 'Duplicate',
          last_name: 'User',
          username: 'duplicateuser',
          DOB: '1990-01-01',
          role: 'USER'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Unique constraint failed on the email');
      expect(usersService.create).toHaveBeenCalled();
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(() => {
      // Mock the LocalAuthGuard to return a user
      jest.spyOn(LocalAuthGuard.prototype, 'canActivate').mockImplementation((context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = {
          email: testUser.email,
          id: testUser.id,
          first_name: testUser.first_name,
          last_name: testUser.last_name,
          username: testUser.username,
          role: testUser.role,
        };
        return true;
      });

      // Mock the auth service login method
      jest.spyOn(authService, 'login').mockResolvedValue({
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        user: {
          id: testUser.id,
          email: testUser.email,
          first_name: testUser.first_name,
          last_name: testUser.last_name,
          username: testUser.username,
          role: testUser.role,
          DOB: testUser.DOB,
        },
      } as any);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('should not login with invalid password', async () => {
      // Mock the LocalAuthGuard to throw UnauthorizedException
      jest.spyOn(LocalAuthGuard.prototype, 'canActivate').mockImplementation(() => {
        throw new UnauthorizedException();
      });

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should not login with non-existent email', async () => {
      // Mock the LocalAuthGuard to throw UnauthorizedException
      jest.spyOn(LocalAuthGuard.prototype, 'canActivate').mockImplementation(() => {
        throw new UnauthorizedException();
      });

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'somepassword',
        })
        .expect(401);
    });
  });
});
