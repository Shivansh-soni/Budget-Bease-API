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
import { CreateAuthDto, RegisterResponseDto } from './dto/create-auth.dto';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
  ApiBody,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
/**
 * Handles authentication-related endpoints including OAuth flows
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Initiate Google OAuth flow
   * This will redirect to Google's OAuth consent screen
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  @ApiOkResponse({ description: 'Redirect to Google OAuth consent screen' })
  async googleAuth() {
    // The AuthGuard will redirect to Google's OAuth consent screen
  }

  /**
   * Google OAuth callback URL
   * Handles the response from Google's OAuth server
   */
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback URL' })
  @ApiOkResponse({
    description: "Handles the response from Google's OAuth server",
  })
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    return this.handleOAuthRedirect(req, res);
  }

  /**
   * Initiate GitHub OAuth flow
   */
  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Initiate GitHub OAuth flow' })
  @ApiOkResponse({ description: 'Redirect to GitHub OAuth consent screen' })
  async githubAuth() {
    // The AuthGuard will redirect to GitHub's OAuth consent screen
  }

  /**
   * GitHub OAuth callback URL
   */
  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth callback URL' })
  @ApiOkResponse({
    description: "Handles the response from GitHub's OAuth server",
  })
  async githubAuthRedirect(@Request() req, @Res() res: Response) {
    return this.handleOAuthRedirect(req, res);
  }

  /**
   * Initiate Facebook OAuth flow
   */
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Initiate Facebook OAuth flow' })
  @ApiOkResponse({ description: 'Redirect to Facebook OAuth consent screen' })
  async facebookAuth() {
    // The AuthGuard will redirect to Facebook's OAuth consent screen
  }

  /**
   * Facebook OAuth callback URL
   */
  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Facebook OAuth callback URL' })
  @ApiOkResponse({
    description: "Handles the response from Facebook's OAuth server",
  })
  async facebookAuthRedirect(@Request() req, @Res() res: Response) {
    return this.handleOAuthRedirect(req, res);
  }

  /**
   * Helper method to handle OAuth redirects
   */
  private async handleOAuthRedirect(req: any, res: Response) {
    try {
      const { access_token, refresh_token } = req.user;

      // Get redirect URI from query (sent from the mobile app)
      const redirectUri = req.query.redirect_uri || 'exp://127.0.0.1:8081'; // fallback for dev

      // Construct redirect URL to the app with tokens
      const redirectUrl = `${redirectUri}?access_token=${access_token}&refresh_token=${refresh_token}`;

      // Optionally set cookies (for web usage)
      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });

      // Redirect user back to Expo app (not web)
      return res.redirect(redirectUrl);
    } catch (error) {
      const redirectUri = req.query.redirect_uri || 'exp://127.0.0.1:8081';
      return res.redirect(
        `${redirectUri}?error=${encodeURIComponent(error.message)}`,
      );
    }
  }

  /**
   * Success handler for Google OAuth
   * Returns user data and tokens as JSON
   */
  @Get('google/success')
  @ApiOperation({ summary: 'Success handler for Google OAuth' })
  @ApiOkResponse({ description: 'Returns user data and tokens as JSON' })
  async googleAuthSuccess(@Request() req) {
    // This endpoint is called after successful Google OAuth
    // The actual user data is passed as a query parameter from the redirect
    const user = req.query.user
      ? JSON.parse(decodeURIComponent(req.query.user as string))
      : null;

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
  @ApiOperation({ summary: 'Failure handler for Google OAuth' })
  @ApiOkResponse({ description: 'Returns error information' })
  async googleAuthFailure(@Request() req) {
    const error = req.query.error
      ? decodeURIComponent(req.query.error as string)
      : 'Authentication failed';
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
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'Returns the created user and authentication tokens',
    type: RegisterResponseDto,
  })
  @ApiBody({ type: CreateAuthDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnprocessableEntityResponse({ description: 'Invalid input data' })
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
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Returns authentication tokens and user data',
    type: RegisterResponseDto,
  })
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  /**
   * Get the current user's profile
   * @param req - The authenticated request
   * @returns The current user's profile
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: "Get the current user's profile" })
  @ApiOkResponse({ description: "Returns the current user's profile" })
  getProfile(@Request() req) {
    return req.user;
  }

  /**
   * Refresh an access token
   * @param body - The refresh token
   * @returns A new access token
   */
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh an access token' })
  @ApiOkResponse({ description: 'Returns a new access token' })
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
  @ApiOperation({ summary: 'Verify a JWT token' })
  @ApiOkResponse({ description: 'Returns the decoded token payload' })
  verify(@Request() req) {
    // If we get here, the token is valid (thanks to JwtAuthGuard)
    return { valid: true, user: req.user };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }
}
