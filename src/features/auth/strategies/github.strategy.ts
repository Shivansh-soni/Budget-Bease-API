import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

type GithubProfile = {
  id: string;
  displayName: string;
  username: string;
  emails: Array<{ value: string; verified: boolean }>;
  photos?: Array<{ value: string }>;
  provider: string;
};

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID = configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = configService.get<string>('GITHUB_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GITHUB_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing required GitHub OAuth configuration');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['user:email'],
      passReqToCallback: false,
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: GithubProfile,
    done: (error: any, user?: any) => void,
  ) {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        throw new Error('Email is required');
      }

      const nameParts = profile.displayName?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      const user = {
        email,
        firstName,
        lastName,
        picture: profile.photos?.[0]?.value,
        accessToken,
      };

      const existingUser = await this.authService.validateOAuthLogin(user);
      return done(null, existingUser);
    } catch (error) {
      return done(error, false);
    }
  }
}
