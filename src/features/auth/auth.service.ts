import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma.service';
import { CreateAuthDto, UpdateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name, { timestamp: true });
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          { id: user.user_id, email: user.email },
          { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
        ),
        this.jwtService.signAsync(
          { id: user.user_id, email: user.email },
          { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
        ),
      ]);
      // console.log(accessToken, refreshToken);
      this.logger.log('Access token: ', accessToken);
      this.logger.log('Refresh token: ', refreshToken);
      this.logger.log(
        `${user.first_name + ' ' + user.last_name} registered recently.`,
      );

      return { user, access_token: accessToken, refresh_token: refreshToken };
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
  async login(loginDto: LoginDto) {
    const { email, username, password } = loginDto;
    if (!email && !username) {
      throw new Error('Email or username is required');
    }
    const user = await this.usersService.getUserByEmail(email, username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
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
      ),
      this.jwtService.signAsync(
        {
          id: user.user_id,
          email: user.email,
          name: user.first_name + ' ' + user.last_name,
          role: user.role,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      ),
    ]);
    this.logger.log(`${user.first_name + ' ' + user.last_name} logged in.`);
    return { access_token: accessToken, refresh_token: refreshToken };
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
  update(id: number, updateAuthDto: UpdateAuthDto) {
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
}
