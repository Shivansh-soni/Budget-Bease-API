import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: any = context.switchToHttp().getRequest();
      if (!request.headers.authorization) {
        throw new UnauthorizedException('Login to continue');
      }
      const token: any = request.headers.authorization.split(' ')[1];
      const user: any = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
