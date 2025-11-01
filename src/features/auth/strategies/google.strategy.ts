import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

// Extend the Profile interface to include the properties we expect
type GoogleProfile = Profile & {
  emails: Array<{ value: string; verified: boolean }>;
  name: { givenName: string; familyName: string };
  photos?: Array<{ value: string }>;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing required Google OAuth configuration');
    }

    // Use type assertion to satisfy the Strategy constructor
    const options = {
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
      passReqToCallback: false,
    };

    super(options as any);
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      // Type assertion to our extended interface
      const googleProfile = profile as GoogleProfile;
      
      const email = googleProfile.emails?.[0]?.value;
      if (!email) {
        throw new Error('Email is required');
      }

      const user = {
        email,
        firstName: googleProfile.name?.givenName || '',
        lastName: googleProfile.name?.familyName || '',
        picture: googleProfile.photos?.[0]?.value,
        accessToken,
      };

      // Find or create user in your database
      const existingUser = await this.authService.validateOAuthLogin(user);
      return done(null, existingUser);
    } catch (error) {
      return done(error as Error, false);
    }
  }
}
