import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Initiate Google OAuth flow
   * This will redirect to Google's OAuth consent screen
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // The AuthGuard will redirect to Google's OAuth consent screen
  }

  /**
   * Google OAuth callback URL
   * Handles the response from Google's OAuth server
   */
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    try {
      // Get tokens and user info from the request
      const { access_token, refresh_token, user } = req.user;
      
      // Set cookies with httpOnly flag for security
      res.cookie('access_token', access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.cookie('refresh_token', refresh_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      
      // Redirect to the success page with user data
      return res.redirect(`/auth/google/success?user=${encodeURIComponent(JSON.stringify(user))}`);
    } catch (error) {
      // Redirect to the failure page with error message
      return res.redirect(`/auth/google/failure?error=${encodeURIComponent(error.message)}`);
    }
  }

  /**
   * Success handler for Google OAuth
   * Returns user data and tokens as JSON
   */
  @Get('google/success')
  async googleAuthSuccess(@Request() req) {
    // This endpoint is called after successful Google OAuth
    // The actual user data is passed as a query parameter from the redirect
    const user = req.query.user ? JSON.parse(decodeURIComponent(req.query.user as string)) : null;
    
    if (!user) {
      throw new Error('No user data available');
    }
    
    return {
      success: true,
      user,
      access_token: req.cookies?.access_token,
      refresh_token: req.cookies?.refresh_token,
    };
  }

  /**
   * Failure handler for Google OAuth
   * Returns error information
   */
  @Get('google/failure')
  async googleAuthFailure(@Request() req) {
    const error = req.query.error ? decodeURIComponent(req.query.error as string) : 'Authentication failed';
    return {
      success: false,
      error,
    };
  }

  // @Get()
  // healthCheck(): object {
  //   return {
  //     status: 'ok',
  //     message: 'Budget Beast is running',
  //     uptime: Math.round(process.uptime()),
  //   };
  // }

  /**
   * Register a new user
   * @param createAuthDto - User registration data
   * @returns The created user and authentication tokens
   */
  @Post('register')
  async register(@Body(new ValidationPipe()) createAuthDto: CreateAuthDto) {
    try {
      return await this.authService.create(createAuthDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log in a user
   * @param req - The request object containing user credentials
   * @returns Authentication tokens and user data
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * Get the current user's profile
   * @param req - The authenticated request
   * @returns The current user's profile
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  /**
   * Refresh an access token
   * @param body - The refresh token
   * @returns A new access token
   */
  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refresh(body.refresh_token);
  }

  /**
   * Verify a JWT token
   * @param req - The request containing the token to verify
   * @returns The decoded token payload
   */
  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verify(@Request() req) {
    // If we get here, the token is valid (thanks to JwtAuthGuard)
    return { valid: true, user: req.user };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }
}
