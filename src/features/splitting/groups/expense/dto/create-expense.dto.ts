import { IsDateString, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExpenseSplitDto } from './create-expense-split.dto';

export class CreateExpenseDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  group_id: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  payer_user_id?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal({ decimal_digits: '2' })
  @Type(() => String)
  @IsNotEmpty()
  total_amount: string;

  @IsDateString()
  @IsOptional()
  expense_date?: Date;
}

export class CreateExpenseWithSplitsDto extends CreateExpenseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseSplitDto)
  splits: CreateExpenseSplitDto[];
}

export class CreateExpenseResponseDto {
  expense_id: number;
  group_id: number;
  payer_user_id: number | null;
  description: string | null;
  total_amount: string;
  expense_date: Date;
  created_at: Date;
  updated_at: Date;
}
