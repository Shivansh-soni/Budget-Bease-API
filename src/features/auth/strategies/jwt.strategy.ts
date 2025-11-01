import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
   constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Validates the JWT payload
   * @param {any} payload - The JWT payload
   * @returns {Promise<{ userId: string; email: string; role: string }>} User information from the token
   */
  async validate(payload: any): Promise<{ userId: string; email: string; role: string }> {
    return {
      userId: payload.id || payload.sub,
      email: payload.email,
      role: payload.role
    };
  }
}
