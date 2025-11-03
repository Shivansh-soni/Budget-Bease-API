import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Local authentication guard that extends the Passport AuthGuard
 * This guard is used to protect routes that require local (email/password) authentication
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
