# Passport.js Authentication Implementation Plan

This document outlines the step-by-step process to implement Passport.js authentication in the Budget Beast application, replacing the current JWT implementation.

## Prerequisites
- Existing NestJS application with JWT authentication
- Installed required packages: `@nestjs/passport`, `passport`, `passport-jwt`, `passport-local`
- Basic understanding of NestJS guards and strategies

## Implementation Steps

### 1. Install Required Dependencies
```bash
npm install @nestjs/passport passport passport-jwt passport-local
npm install -D @types/passport-jwt @types/passport-local
```

### 2. Create Passport Strategy Files

#### 2.1 Local Strategy (for username/password login)
Create `src/auth/strategies/local.strategy.ts`:
```typescript
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

#### 2.2 JWT Strategy (for protected routes)
Create `src/auth/strategies/jwt.strategy.ts`:
```typescript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```

### 3. Update Auth Module

#### 3.1 Update `auth.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

### 4. Update Auth Service

#### 4.1 Add `validateUser` method to `auth.service.ts`:
```typescript
async validateUser(email: string, password: string): Promise<any> {
  const user = await this.usersService.getUserByEmail(email);
  if (user && await bcrypt.compare(password, user.password)) {
    const { password, ...result } = user;
    return result;
  }
  return null;
}

async login(user: any) {
  const payload = { 
    username: user.email, 
    sub: user.user_id,
    role: user.role 
  };
  
  return {
    access_token: this.jwtService.sign(payload),
  };
}
```

### 5. Update Auth Controller

#### 5.1 Update `auth.controller.ts`:
```typescript
import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
```

### 6. Create Auth Guards (Optional but Recommended)

#### 6.1 Create `jwt-auth.guard.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

#### 6.2 Create `local-auth.guard.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

### 7. Protect Routes

#### 7.1 Use guards in controllers:
```typescript
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  // Your protected routes here
}
```

### 8. Update Environment Variables

Update your `.env` file:
```
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=60m
```

### 9. Test the Implementation

1. Test login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

2. Test protected route:
```bash
curl http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Additional Considerations

1. **Refresh Tokens**: Implement refresh token rotation for better security
2. **Rate Limiting**: Add rate limiting to prevent brute force attacks
3. **Logging**: Add comprehensive logging for authentication attempts
4. **Session Management**: Consider implementing session management for additional security
5. **Two-Factor Authentication**: Add 2FA for sensitive operations

## Troubleshooting

1. **Invalid JWT Token**: Verify the JWT_SECRET matches between signing and verification
2. **CORS Issues**: Ensure proper CORS configuration in `main.ts`
3. **Dependency Issues**: Make sure all required packages are installed with correct versions
4. **Environment Variables**: Double-check that all required environment variables are set

## Next Steps

1. Implement role-based access control (RBAC)
2. Add password reset functionality
3. Implement email verification
4. Add security headers using Helmet
5. Set up API documentation with Swagger

## References

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [JWT Best Practices](https://auth0.com/docs/secure/tokens/json-web-tokens)
