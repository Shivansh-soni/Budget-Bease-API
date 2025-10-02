import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../../../prisma.service';
import {
  CreateExpenseDto,
  CreateExpenseWithSplitsDto,
  CreateExpenseResponseDto,
} from '../dto/create-expense.dto';
import { CreateExpenseSplitDto } from '../dto/create-expense-split.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';

/**
 * Service responsible for handling expense-related operations within groups
 * Handles creation, retrieval, updating, and deletion of expenses and their splits
 * @class ExpenseService
 */
@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new expense with splits in a group
   * @param {CreateExpenseWithSplitsDto} createExpenseDto - The expense data including splits
   * @returns {Promise<CreateExpenseResponseDto>} The created expense with its details
   * @throws {NotFoundException} If the group is not found
   * @throws {BadRequestException} If payer is not a group member or if split validations fail
   */
  async create(
    createExpenseDto: CreateExpenseWithSplitsDto,
  ): Promise<CreateExpenseResponseDto> {
    const {
      group_id,
      payer_user_id,
      description,
      total_amount,
      expense_date,
      splits,
    } = createExpenseDto;

    // Check if group exists
    const group = await this.prisma.groups.findUnique({
      where: { group_id },
      include: {
        members: true,
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${group_id} not found`);
    }

    // If payer_user_id is provided, check if user exists and is a member of the group
    if (payer_user_id) {
      const userExists = group.members.some(
        (member) => member.user_id === payer_user_id,
      );
      if (!userExists) {
        throw new BadRequestException(
          `Payer with ID ${payer_user_id} is not a member of group ${group_id}`,
        );
      }
    } else {
      // If no payer is specified, we'll still create the expense but won't update any balances
      const expense = await this.prisma.group_expenses.create({
        data: {
          group_id,
          description,
          total_amount: total_amount,
          expense_date: expense_date ? new Date(expense_date) : new Date(),
          splits: {
            create: splits.map((split) => ({
              user_id: split.user_id,
              share_amount: split.share_amount,
              is_paid: split.is_paid || false,
            })),
          },
        },
      });

      return {
        expense_id: expense.expense_id,
        group_id: expense.group_id,
        payer_user_id: expense.payer_user_id,
        description: expense.description,
        total_amount: expense.total_amount.toString(),
        expense_date: expense.expense_date,
        created_at: expense.created_at,
        updated_at: expense.updated_at,
      };
    }

    // Validate that all users in splits are group members
    const splitUserIds = new Set(splits.map((split) => split.user_id));
    const invalidUsers = [...splitUserIds].filter(
      (userId) => !group.members.some((member) => member.user_id === userId),
    );

    if (invalidUsers.length > 0) {
      throw new BadRequestException(
        `The following users are not members of the group: ${invalidUsers.join(', ')}`,
      );
    }

    // Calculate total of all shares
    const totalShares = splits.reduce(
      (sum, split) => sum + parseFloat(split.share_amount),
      0,
    );

    if (Math.abs(totalShares - parseFloat(total_amount)) > 0.01) {
      throw new BadRequestException(
        `Total of share amounts (${totalShares}) does not match expense total (${total_amount})`,
      );
    }

    // Start a transaction to ensure data consistency
    const [expense] = await this.prisma.$transaction([
      this.prisma.group_expenses.create({
        data: {
          group_id,
          payer_user_id,
          description,
          total_amount: total_amount,
          expense_date: expense_date ? new Date(expense_date) : new Date(),
          splits: {
            create: splits.map((split) => ({
              user_id: split.user_id,
              share_amount: split.share_amount,
              is_paid: split.is_paid || false,
            })),
          },
        },
        include: {
          splits: true,
        },
      }),
      // Update group balances
      ...splits.flatMap((split) => {
        if (payer_user_id && split.user_id !== payer_user_id) {
          const amount = parseFloat(split.share_amount);
          return [
            // Update balance for the user who owes money
            this.prisma.group_balances.upsert({
              where: {
                uq_group_balances_triplet: {
                  group_id,
                  from_user_id: split.user_id,
                  to_user_id: payer_user_id,
                },
              },
              update: {
                amount_owed: {
                  increment: amount,
                },
                last_updated: new Date(),
              },
              create: {
                group_id,
                from_user_id: split.user_id,
                to_user_id: payer_user_id,
                amount_owed: amount,
              },
            }),
            // Update reverse balance (payer to user) if it exists
            this.prisma.group_balances.updateMany({
              where: {
                group_id,
                from_user_id: payer_user_id,
                to_user_id: split.user_id,
                amount_owed: {
                  gt: 0,
                },
              },
              data: {
                amount_owed: {
                  decrement: Math.min(amount, 0), // This will be negative or zero
                },
                last_updated: new Date(),
              },
            }),
          ];
        }
        return [];
      }),
    ]);

    return {
      expense_id: expense.expense_id,
      group_id: expense.group_id,
      payer_user_id: expense.payer_user_id,
      description: expense.description,
      total_amount: expense.total_amount.toString(),
      expense_date: expense.expense_date,
      created_at: expense.created_at,
      updated_at: expense.updated_at,
    };
  }

  /**
   * Retrieves all expenses for a specific group with summary information
   * @param {number} group_id - The ID of the group
   * @returns {Promise<{expense: any[], totalAmount: number, unpaidAmount: number}>} 
   *   Object containing expenses, total amount, and unpaid amount
   */
  async findAllByGroup(group_id: number) {
    // return this.prisma.group_expenses.findMany({
    //   where: {
    //     group_id,
    //   },
    //   include: {
    //     splits: true,
    //     payer: true,
    //   },
    // });

    const expense = await this.prisma.group_expenses.findMany({
      where: {
        group_id,
      },
      include: {
        splits: true,
        payer: true,
      },
    });

    const totalAmount = expense.reduce((total, expense) => {
      return total + Number(expense.total_amount);
    }, 0);
    const unpaidAmount = expense.reduce((total, expense) => {
      return (
        total +
        expense.splits.reduce((total, split) => {
          console.log('total', total);
          console.log('split', split);
          if (!split.is_paid) {
            return total + Number(split.share_amount);
          }
          return total;
        }, 0)
      );
    }, 0);
    return {
      expense,
      totalAmount,
      unpaidAmount,
    };
  }

  /**
   * Retrieves all expenses for a specific group with detailed information
   * @param {number} group_id - The ID of the group
   * @returns {Promise<any[]>} List of expenses with their splits and payer information
   */
  async findAll(group_id: number) {
    return await this.prisma.group_expenses.findMany({
      where: {
        group_id,
      },
      include: {
        splits: true,
        payer: true,
      },
    });
  }

  /**
   * Retrieves a specific expense by ID with detailed information
   * @param {number} id - The ID of the expense to retrieve
   * @returns {Promise<any>} The expense with its splits and payer information
   */
  async findOne(id: number) {
    const expense = await this.prisma.group_expenses.findMany({
      where: {
        group_id: +id,
      },
      include: {
        splits: true,
        payer: {
          select: {
            first_name: true,
            last_name: true,
            username: true,
          },
        },
      },
    });
    console.log('expense', expense);
    return expense;
  }

  /**
   * Updates an existing expense
   * @param {number} id - The ID of the expense to update
   * @param {UpdateExpenseDto} updateExpenseDto - The data to update
   * @returns {string} A message indicating the update action
   * @todo Implement the actual update logic
   */
  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  /**
   * Deletes an expense by ID
   * @param {number} id - The ID of the expense to delete
   * @returns {Promise<any>} The deleted expense record
   */
  async remove(id: number) {
    return await this.prisma.group_expenses.delete({
      where: {
        expense_id: id,
      },
    });
  }
}
