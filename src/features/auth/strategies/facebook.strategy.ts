import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

type FacebookProfile = {
  id: string;
  displayName: string;
  name: { givenName: string; familyName: string };
  emails: Array<{ value: string; verified: boolean }>;
  photos?: Array<{ value: string }>;
  provider: string;
};

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID = configService.get<string>('FACEBOOK_APP_ID');
    const clientSecret = configService.get<string>('FACEBOOK_APP_SECRET');
    const callbackURL = configService.get<string>('FACEBOOK_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing required Facebook OAuth configuration');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      profileFields: ['id', 'emails', 'name', 'photos'],
      scope: ['email', 'public_profile'],
      passReqToCallback: false,
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: FacebookProfile,
    done: (error: any, user?: any) => void,
  ) {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        throw new Error('Email is required');
      }

      const user = {
        email,
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || '',
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
