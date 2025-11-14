import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { CategoriesService } from '../Finance/categories/service/categories.service';

interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  accessToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name, { timestamp: true });
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly categoriesService: CategoriesService,
  ) {}
  /**
   * Creates a new user account and generates an access token
   * @param {CreateAuthDto} createAuthDto - The user registration data
   * @returns {Promise<Object>} The created user and access token
   * @throws {BadRequestException} If user creation fails
   */
  async create(createAuthDto: CreateAuthDto) {
    try {
      const { password, ...rest } = createAuthDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersService.create({
        ...rest,
        password: hashedPassword,
      });

      await this.categoriesService.seedDefaultCategories(user.user_id);

      const payload = {
        email: user.email,
        sub: user.user_id,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`,
      };

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        }),
        this.jwtService.signAsync(payload, {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        }),
      ]);

      this.logger.log('User registered successfully');
      this.logger.log(`New user: ${user.first_name} ${user.last_name}`);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user.user_id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
        },
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Authenticates a user and generates an access token
   * @param {LoginDto} loginDto - The login credentials (email/username and password)
   * @returns {Promise<Object>} An access token for the authenticated user
   * @throws {Error} If credentials are invalid or user is not found
   * @throws {NotFoundException} If the user does not exist
   */
  /**
   * Validates user credentials
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} username - User's username
   * @returns {Promise<any>} User object without password if valid, null otherwise
   */

  async validateUser(
    email: string,
    password: string,
    username?: string,
  ): Promise<any> {
    const user = await this.usersService.getUserByEmail(email, username ?? '');
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Handles user login
   * @param {any} user - The authenticated user
   * @returns {Promise<{ access_token: string; refresh_token: string }>} JWT tokens
   */
  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.user_id,
      role: user.role,
      name: `${user.first_name} ${user.last_name}`,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_ACCESS_SECRET,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    ]);

    this.logger.log(`${user.first_name} ${user.last_name} logged in.`);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.user_id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
      },
    };
  }

  /**
   * Retrieves all authentication records (placeholder)
   * @returns {string} Placeholder message
   */
  findAll() {
    return `This action returns all auth`;
  }

  async refresh(token: string) {
    const decoded = this.jwtService.decode(token);

    const user: any = await this.usersService.findOne(+decoded.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const accessToken = await this.jwtService.signAsync(
      {
        id: user.user_id,
        email: user.email,
        name: user.first_name + ' ' + user.last_name,
        role: user.role,
      },
      {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      },
    );
    return { access_token: accessToken };
  }

  async verifyToken(token: string) {
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    const user: any = await this.usersService.findOne(+decoded.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { isLoggedIn: true, user };
  }

  /**
   * Finds an authentication record by ID (placeholder)
   * @param {number} id - The ID of the authentication record
   * @returns {string} Placeholder message
   */
  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  /**
   * Updates an authentication record (placeholder)
   * @param {number} id - The ID of the authentication record to update
   * @param {UpdateAuthDto} updateAuthDto - The data to update
   * @returns {string} Placeholder message
   */
  async update(id: number, updateAuthDto: any) {
    // Implementation for updating user
    return `This action updates a #${id} auth`;
  }

  /**
   * Removes an authentication record (placeholder)
   * @param {number} id - The ID of the authentication record to remove
   * @returns {string} Placeholder message
   */
  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  /**
   * Validates or creates a user from OAuth login
   * @param {GoogleUser} user - The user data from Google OAuth
   * @returns {Promise<any>} The authenticated user with tokens
   */
  async validateOAuthLogin(user: GoogleUser) {
    try {
      // Check if user exists
      let dbUser = await this.prisma.users.findUnique({
        where: { email: user.email },
      });

      // If user doesn't exist, create a new one
      if (!dbUser) {
        // Create a username from email (remove @ and everything after it)
        const username = user.email.split('@')[0].toLowerCase();

        dbUser = await this.prisma.users.create({
          data: {
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            username: username, // Required field in schema
            password: await bcrypt.hash(
              Math.random().toString(36).slice(-12),
              10,
            ), // Random password
            profile_picture: user.picture || null,
            DOB: new Date(), // Required field in schema, setting to current date as default
          },
        });
      }
      await this.categoriesService.seedDefaultCategories(dbUser.user_id);
      // Generate tokens
      const payload = {
        email: dbUser.email,
        sub: dbUser.user_id,
        role: dbUser.role,
        name: `${dbUser.first_name} ${dbUser.last_name}`,
      };

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          expiresIn: '1h',
          secret: process.env.JWT_ACCESS_SECRET,
        }),
        this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_SECRET,
        }),
      ]);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: dbUser.user_id,
          email: dbUser.email,
          name: `${dbUser.first_name} ${dbUser.last_name}`,
          role: dbUser.role,
          picture: dbUser.profile_picture,
        },
      };
    } catch (error) {
      this.logger.error('Error in validateOAuthLogin', error);
      throw new BadRequestException('Error validating OAuth login');
    }
  }
}
