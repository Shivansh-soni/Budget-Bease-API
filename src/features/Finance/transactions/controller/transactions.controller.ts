import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiResponseDto } from '../../../../common/dto/api-response.dto';
import { Transaction } from '../entities/transaction.entity';

type TransactionType = 'income' | 'expense';

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new transaction',
    description: 'Creates a new financial transaction (income or expense)',
  })
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Transaction details',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Transaction created successfully',
    type: Transaction,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: any,
  ): Promise<ApiResponseDto<Transaction>> {
    const transaction = await this.transactionsService.create(
      createTransactionDto,
      req.user,
    );
    return new ApiResponseDto({
      data: transaction,
      message: 'Transaction created successfully',
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get all transactions',
    description: 'Retrieves a list of transactions with optional filtering',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['income', 'expense'],
    description: 'Filter transactions by type',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
    description: 'Filter transactions by category ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of transactions',
    type: [Transaction],
  })
  async findAll(
    @Request() req: any,
    @Query('type') type?: TransactionType,
    @Query('categoryId') categoryId?: number,
  ): Promise<ApiResponseDto<Transaction[]>> {
    const transactions = await this.transactionsService.findAll(req.user.id);
    return new ApiResponseDto({
      data: transactions,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get transaction by ID',
    description: 'Retrieves a single transaction by its ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Numeric ID of the transaction',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction details',
    type: Transaction,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<Transaction>> {
    const transaction = await this.transactionsService.findOne(+id);
    return new ApiResponseDto({
      data: transaction,
    });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a transaction',
    description: 'Updates an existing transaction',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Numeric ID of the transaction to update',
    type: Number,
  })
  @ApiBody({
    description: 'Transaction update data',
    type: UpdateTransactionDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction updated successfully',
    type: Transaction,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not authorized to update this transaction',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req: any,
  ): Promise<ApiResponseDto<Transaction>> {
    const transaction = await this.transactionsService.update(
      +id,
      updateTransactionDto,
      req.user.id,
    );
    return new ApiResponseDto({
      data: transaction,
      message: 'Transaction updated successfully',
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a transaction',
    description: 'Deletes a transaction by ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Numeric ID of the transaction to delete',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not authorized to delete this transaction',
  })
  async remove(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ApiResponseDto<void>> {
    await this.transactionsService.remove(+id, req.user.id);
    return new ApiResponseDto({
      message: 'Transaction deleted successfully',
    });
  }
}
