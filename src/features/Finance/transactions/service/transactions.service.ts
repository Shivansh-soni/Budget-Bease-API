import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { PrismaService } from 'src/prisma.service';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { SavingsService } from '../../savings/service/savings.service';
import { CategoriesService } from '../../categories/service/categories.service';

/**
 * Service responsible for handling transaction-related operations
 * @class TransactionsService
 * @public
 */
@Injectable()
export class TransactionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoryService: CategoriesService,
    private readonly savingService: SavingsService,
  ) {}
  /**
   * Creates a new transaction
   * @param {CreateTransactionDto} createTransactionDto - The transaction data to create
   * @param {Object} user - The user object containing user information
   * @param {string} user.id - The ID of the user creating the transaction
   * @param {string} user.name - The name of the user creating the transaction
   * @returns {Promise<Object>} The created transaction
   * @throws {Error} If there's an error during transaction creation
   */
  async create(createTransactionDto: CreateTransactionDto, user: any) {
    try {
      const payload = {
        ...createTransactionDto,
        payer_name: user.name,
        user_id: user.id,
      };

      if (createTransactionDto.category_id) {
        await this.categoryService.addCategoryTransaction(
          createTransactionDto.category_id,
          +createTransactionDto.amount,
          createTransactionDto.type,
        );
      }

      if (createTransactionDto.savings_id) {
        await this.savingService.addSavingTransaction(
          createTransactionDto.savings_id,
          +createTransactionDto.amount,
          createTransactionDto.type,
          user.id,
        );
      }
      return await this.prismaService.personal_transactions.create({
        data: payload,
      });
    } catch (error) {
      console.log('error', error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Retrieves all transactions for a specific user
   * @param {string} user_id - The ID of the user
   * @returns {Promise<Array<Object>>} List of transactions belonging to the user
   * @throws {NotFoundException} If the user ID is invalid
   * @throws {InternalServerErrorException} If there's an error retrieving transactions
   */
  async findAll(user_id: string) {
    if (!user_id) {
      throw new NotFoundException('User ID is invalid');
    }
    try {
      const res = await this.prismaService.personal_transactions.findMany({
        where: { user_id: +user_id },
        include: {
          category: {
            select: {
              icon: true,
            },
          },
        },
      });

      return res;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('something wend wrong');
    }
  }

  /**
   * Retrieves a single transaction by its ID
   * @param {number} id - The ID of the transaction to find
   * @returns {Promise<Object>} The found transaction
   * @throws {NotFoundException} If no transaction is found with the given ID
   * @throws {Error} If there's an error retrieving the transaction
   */
  async findOne(id: number) {
    if (!id) {
      throw new NotFoundException('Kindly provide a transaction ID');
    }
    try {
      return await this.prismaService.personal_transactions.findUnique({
        where: { transaction_id: id },
        include: {
          category: { select: { icon: true, name: true } },
        },
      });
    } catch (error) {
      console.log('error');
      throw new Error();
    }
  }

  /**
   * Updates an existing transaction
   * @param {number} id - The ID of the transaction to update
   * @param {UpdateTransactionDto} updateTransactionDto - The data to update the transaction with
   * @param {number} user_id - The ID of the user making the request
   * @returns {Promise<Object>} The updated transaction
   * @throws {BadRequestException} If the transaction ID is not provided
   * @throws {NotFoundException} If the transaction is not found or doesn't belong to the user
   */
  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    user_id: number,
  ) {
    if (!id) {
      throw new BadRequestException('kindly provide a ID');
    }
    try {
      const res = await this.prismaService.personal_transactions.update({
        where: { transaction_id: id, user_id: user_id },
        data: updateTransactionDto,
      });
      return res;
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }
  }

  /**
   * Removes a transaction by its ID
   * @param {number} id - The ID of the transaction to remove
   * @param {number} user_id - The ID of the user making the request
   * @returns {Promise<Object>} The deleted transaction
   * @throws {BadRequestException} If the transaction ID is not provided
   * @throws {NotFoundException} If the transaction is not found or doesn't belong to the user
   */
  async remove(id: number, user_id: number) {
    if (!id) {
      throw new BadRequestException('kindly provide a ID');
    }
    try {
      const res = await this.prismaService.personal_transactions.delete({
        where: { transaction_id: id, user_id: user_id },
      });
      return res;
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }
  }
}
