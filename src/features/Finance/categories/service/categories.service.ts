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
import { DefaultCategories } from 'src/utils/constants/categories';

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
  async create(user_id: number, createCategoryDto: CreateCategoryDto) {
    try {
      const { icon, ...rest } = createCategoryDto;

      const res = await this.prismaService.categories.create({
        data: {
          ...rest,
          // color: color || '#3B82F6', // Default color if not provided
          icon: icon || 'tag', // Default icon if not provided
          user_id,
        },
      });
      return res;
    } catch (error) {
      console.error('Error creating category:', error.message);
      if (error.message.includes('Unique')) {
        throw new ConflictException(
          'A category with this name and type already exists',
        );
      } else {
        throw new InternalServerErrorException('Failed to create category');
      }
    }
  }

  /**
   * Retrieves all categories for a specific user
   * @param {string} id - The ID of the user
   * @returns {Promise<Array<Object>>} List of categories belonging to the user
   * @throws {ForbiddenException} If the user ID is invalid
   */
  async seedDefaultCategories(userId: number): Promise<void> {
    try {
      // Create each default category for the user
      await Promise.all(
        DefaultCategories.map((category) =>
          this.prismaService.categories.create({
            data: {
              user_id: userId,
              name: category.name,
              type: category.type as any, // Type assertion since we know the values match
              description: category.description,
              total_budget: 0, // Default budget of 0, can be updated later
              amount_remaining: 0,
              // color: this.getDefaultColorForCategory(category.type),
              icon: category.icon,
            },
          }),
        ),
      );
    } catch (error) {
      console.error('Error seeding default categories:', error);
      // Don't throw error to prevent signup failure due to category seeding
    }
  }

  /**
   * Gets a default color based on category type
   * @private
   */
  private getDefaultColorForCategory(type: string): string {
    // Default colors for different category types
    const colors = {
      income: '#10B981', // Green for income
      expense: '#EF4444', // Red for expense
    };
    return colors[type] || '#3B82F6'; // Default blue if type not matched
  }

  /**
   * Finds all categories for a specific user
   * @param {string} id - The ID of the user
   * @returns {Promise<Array>} List of categories belonging to the user
   * @throws {ForbiddenException} If the user ID is invalid
   */
  async findByUser(id: string) {
    if (!id) {
      throw new ForbiddenException('Invalid User ID');
    }
    try {
      return await this.prismaService.categories.findMany({
        where: {
          user_id: Number(id),
        },
        orderBy: {
          created_at: 'desc', // Most recent first
        },
      });
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      throw new InternalServerErrorException('Failed to fetch categories');
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
  /**
   * Updates an existing category with the provided data
   * @param {number} user_id - The ID of the user updating the category
   * @param {number} id - The ID of the category to update
   * @param {UpdateCategoryDto} updateCategoryDto - The data to update the category with
   * @returns {Promise<Object>} The updated category with all fields including color and icon
   * @throws {NotFoundException} If the category is not found
   * @throws {ConflictException} If a category with the same name and type already exists
   * @throws {InternalServerErrorException} For any other unexpected errors
   */
  async update(
    user_id: number,
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    if (!id) {
      throw new NotFoundException('Category not found');
    }

    // Check if the category exists and belongs to the user
    const category = await this.prismaService.categories.findFirst({
      where: {
        category_id: id,
        user_id: user_id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found or access denied');
    }

    // Check if the update would result in a duplicate category
    if (updateCategoryDto.name || updateCategoryDto.type) {
      const existingCategory = await this.prismaService.categories.findFirst({
        where: {
          user_id,
          name: updateCategoryDto.name || category.name,
          type: updateCategoryDto.type || category.type,
          NOT: {
            category_id: id,
          },
        },
      });

      if (existingCategory) {
        throw new ConflictException(
          'A category with this name and type already exists',
        );
      }
    }

    try {
      const { color, icon, ...rest } = updateCategoryDto;

      const updateData = {
        ...rest,
        ...(color !== undefined && { color }), // Only include color if it's provided
        ...(icon !== undefined && { icon }), // Only include icon if it's provided
      };

      const res = await this.prismaService.categories.update({
        where: {
          category_id: id,
        },
        data: updateData,
      });

      return res;
    } catch (error) {
      console.error('Error updating category:', error.message);
      if (error.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
      throw new InternalServerErrorException('Failed to update category');
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
