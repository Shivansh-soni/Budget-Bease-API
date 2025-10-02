import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExpenseService } from '../service/expense.service';
import { CreateExpenseWithSplitsDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { AuthGuard } from '@/modules/gaurds/AuthGaurd';

UseGuards(AuthGuard);
@Controller('group/:groupId/expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createExpenseDto: CreateExpenseWithSplitsDto,
  ) {
    return this.expenseService.create(createExpenseDto);
  }

  @Get()
  findAll(@Param('groupId') group_id: number) {
    return this.expenseService.findAll(+group_id);
  }

  @Get('/balance/:id')
  findAllByGroup(@Param('groupId') group_id: number) {
    return this.expenseService.findAllByGroup(+group_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseService.remove(+id);
  }
}
