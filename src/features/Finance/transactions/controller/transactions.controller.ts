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
import { AuthGuard } from 'src/modules/gaurds/AuthGaurd';

@UseGuards(AuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createTransactionDto: CreateTransactionDto,
    @Request() req: any,
  ) {
    return this.transactionsService.create(createTransactionDto, req.user);
  }

  @Get()
  findAll(
    @Request()
    req: any,
  ) {
    return this.transactionsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
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
  remove(@Param('id') id: string, @Request() req: any) {
    return this.transactionsService.remove(+id, req.user.id);
  }
}
