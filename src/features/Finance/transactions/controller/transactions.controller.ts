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
  ValidationPipe,
} from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import {
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiOkResponse({ type: CreateTransactionDto })
  create(
    @Body(new ValidationPipe()) createTransactionDto: CreateTransactionDto,
    @Request() req: any,
  ) {
    return this.transactionsService.create(createTransactionDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Find all transactions' })
  @ApiOkResponse({ type: CreateTransactionDto })
  findAll(
    @Request()
    req: any,
  ) {
    return this.transactionsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a transaction by ID' })
  @ApiOkResponse({ type: CreateTransactionDto })
  @ApiParam({ name: 'id', description: 'ID of the transaction' })
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction by ID' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiOkResponse({ type: UpdateTransactionDto })
  @ApiParam({ name: 'id', description: 'ID of the transaction' })
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateTransactionDto: UpdateTransactionDto,
    @Request() req: any,
  ) {
    return this.transactionsService.update(
      +id,
      updateTransactionDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction by ID' })
  @ApiOkResponse({ type: CreateTransactionDto })
  @ApiParam({ name: 'id', description: 'ID of the transaction' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.transactionsService.remove(+id, req.user.id);
  }
}
