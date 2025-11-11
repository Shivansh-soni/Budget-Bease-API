import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma.service';
import { CreateAuthDto } from 'src/features/auth/dto/create-auth.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds a user by email or username
   * @param {string} email - The email of the user to find
   * @param {string} username - The username of the user to find
   * @returns {Promise<Object>} The found user without sensitive information
   * @throws {NotAcceptableException} If neither email nor username is provided
   */
  async getUserByEmail(email: string, username: string) {
    if (!email && !username) {
      throw new NotAcceptableException(
        'Kindly provide a valid email or username',
      );
    }

    const payload = email ? { email } : { username };

    const user = await this.prisma.users.findUnique({
      where: payload,
      select: {
        user_id: true,
        role: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
      },
    });
    return user;
  }

  /**
   * Creates a new user
   * @param {CreateAuthDto} createUserDto - The user data to create
   * @returns {Promise<Object>} The created user
   */
  create(createUserDto: CreateAuthDto) {
    return this.prisma.users.create({
      data: createUserDto,
    });
  }

  /**
   * Retrieves all users (placeholder)
   * @returns {string} Placeholder message
   */
  findAll() {
    return `This action returns all users`;
  }

  /**
   * Retrieves a user's profile by ID
   * @param {number} id - The ID of the user
   * @returns {Promise<Object>} The user's profile information
   * @throws {Error} If the user is not found
   */
  showProfile(id: number) {
    if (!id) {
      throw new Error('User not found');
    }
    return this.prisma.users.findUnique({
      where: {
        user_id: id,
      },
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        DOB: true,
        username: true,
        role: true,
      },
    });
  }

  /**
   * Finds a user by ID (placeholder)
   * @param {number} id - The ID of the user to find
   * @returns {string} Placeholder message
   */
  async findOne(id: number) {
    return await this.prisma.users.findUnique({
      where: {
        user_id: id,
      },
      select: {
        user_id: true,
        role: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
      },
    });
  }

  /**
   * Updates a user's information
   * @param {number} id - The ID of the user to update
   * @param {UpdateUserDto} updateUserDto - The data to update the user with
   * @returns {Promise<Object>} The updated user or a message if no changes were made
   * @throws {Error} If the user is not found or an error occurs during update
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const getUser = await this.prisma.users.findUnique({
      where: {
        user_id: id,
      },
    });
    if (!getUser) {
      throw new Error('User not found');
    }

    let isMatched = false;

    Object.keys(updateUserDto).forEach((key) => {
      if (updateUserDto[key] === getUser[key]) {
        isMatched = true;
      }
    });

    if (isMatched) {
      return {
        message: 'no changes made',
      };
    }

    try {
      return await this.prisma.users.update({
        where: {
          user_id: id,
        },
        data: updateUserDto,
      });
    } catch (error) {
      throw new Error('User not found');
    }
  }

  /**
   * Removes a user (placeholder)
   * @param {number} id - The ID of the user to remove
   * @returns {string} Placeholder message
   */
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
