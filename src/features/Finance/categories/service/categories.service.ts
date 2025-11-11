import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';
import { transaction_type } from 'generated/prisma';

/**
 * Service responsible for handling category-related operations
 * @class CategoriesService
 * @public
 */
@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates a new category
   * @param {CreateCategoryDto} createCategoryDto - The category data to create
   * @returns {Promise<Object>} The created category
   * @throws {ConflictException} If a category with the same name and type already exists
   * @throws {Error} For any other unexpected errors
   */
  /**
   * Creates a new category
   * @param {CreateCategoryDto} createCategoryDto - The category data to create
   * @returns {Promise<Object>} The created category
   * @throws {ConflictException} If a category with the same name and type already exists
   * @throws {Error} For any other unexpected errors
   */
  async create(user_id: number, createCategoryDto: CreateCategoryDto) {
    try {
      const res = await this.prismaService.categories.create({
        data: { ...createCategoryDto, user_id },
      });
      return res;
    } catch (error) {
      console.log('msg', error.message);
      if (error.message.includes('Unique')) {
        throw new ConflictException(error.message);
      } else {
        throw new Error();
      }
    }
  }

  /**
   * Finds all categories for a specific user
   * @param {string} id - The ID of the user
   * @returns {Promise<Array>} List of categories belonging to the user
   * @throws {ForbiddenException} If the user ID is invalid
   */
  /**
   * Retrieves all categories for a specific user
   * @param {string} id - The ID of the user
   * @returns {Promise<Array<Object>>} List of categories belonging to the user
   * @throws {ForbiddenException} If the user ID is invalid
   */
  async findByUser(id: string) {
    if (!id) {
      throw new ForbiddenException('Invalid User ID');
    }
    try {
      const res = await this.prismaService.categories.findMany({
        where: {
          user_id: Number(id),
        },
      });

      return res;
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * Finds a single category by its ID
   * @param {number} id - The ID of the category to find
   * @returns {Promise<Object>} The found category
   * @throws {NotFoundException} If no category is found with the given ID
   */
  /**
   * Retrieves a single category by its ID
   * @param {number} id - The ID of the category to find
   * @returns {Promise<Object>} The found category
   * @throws {NotFoundException} If no category is found with the given ID
   */
  async findOne(id: number) {
    if (!id) {
      throw new NotFoundException('Category not found');
    }
    try {
      return await this.prismaService.categories.findUnique({
        where: {
          category_id: id,
        },
      });
    } catch (error) {}
  }

  /**
   * Updates an existing category
   * @param {number} user_id - The ID of the user making the request
   * @param {number} id - The ID of the category to update
   * @param {UpdateCategoryDto} updateCategoryDto - The data to update the category with
   * @returns {Promise<Object>} The updated category or a message if no changes were made
   * @throws {NotFoundException} If the category is not found
   */
  /**
   * Updates an existing category
   * @param {number} user_id - The ID of the user making the request
   * @param {number} id - The ID of the category to update
   * @param {UpdateCategoryDto} updateCategoryDto - The data to update the category with
   * @returns {Promise<Object>} The updated category or a message if no changes were made
   * @throws {NotFoundException} If the category is not found
   */
  async update(
    user_id: number,
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    if (!id) {
      throw new NotFoundException('Category not found');
    }

    const oldValue: any = await this.findOne(id);

    if (
      oldValue['name'] === updateCategoryDto['name'] &&
      oldValue['type'] === updateCategoryDto['type']
    ) {
      return {
        message: 'No value changed',
      };
    }
    try {
      const res = await this.prismaService.categories.update({
        where: {
          user_id,
          category_id: id,
        },
        data: updateCategoryDto,
      });
      return res;
    } catch (error) {
      console.log('error', error.message);
    }
  }

  /**
   * Service responsible for handling category-related operations
   * @class CategoriesService
   * @public
   */

  /**
   * Adds a transaction to a category
   * @param {number} category_id - The ID of the category to add the transaction to
   * @param {number} amount - The amount of the transaction
   * @param {transaction_type} type - The type of the transaction
   * @returns {Promise<Object>} The updated category
   * @throws {Error} If the category is not found
   */
  async addCategoryTransaction(
    category_id: number,
    amount: number,
    type: transaction_type,
  ) {
    if (!category_id) {
      throw new NotFoundException('Category not found');
    }
    try {
      const category = await this.findOne(category_id);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      const res = await this.prismaService.categories.update({
        where: {
          category_id,
        },
        data: {
          amount_spent:
            type === 'expense'
              ? category.amount_spent + amount
              : category.amount_spent - amount,
          amount_remaining: category.amount_remaining
            ? type === 'expense'
              ? category.amount_remaining - amount
              : category.amount_remaining + amount
            : category.total_budget,
        },
      });
      return res;
    } catch (error) {
      console.log('error', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Removes a category by its ID
   * @param {number} id - The ID of the category to remove
   * @returns {Promise<Object>} The deleted category
   * @throws {NotFoundException} If the category is not found
   * @throws {Error} If there's an error during deletion
   */
  /**
   * Removes a category by its ID
   * @param {number} id - The ID of the category to remove
   * @returns {Promise<Object>} The deleted category
   * @throws {NotFoundException} If the category is not found
   * @throws {Error} If there's an error during deletion
   */
  async remove(id: number) {
    if (!id) {
      throw new NotFoundException('Category not found');
    }

    try {
      return await this.prismaService.categories.delete({
        where: {
          category_id: id,
        },
      });
    } catch (error) {
      console.log('error', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
