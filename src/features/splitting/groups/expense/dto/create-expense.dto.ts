import {
  IsDateString,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExpenseSplitDto } from './create-expense-split.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Group ID',
    example: 1,
  })
  group_id: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty({
    description: 'Payer user ID',
    example: 1,
  })
  payer_user_id?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description',
    example: 'Groceries',
  })
  description?: string;

  @IsDecimal({ decimal_digits: '2' })
  @Type(() => String)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Total amount',
    example: 100,
  })
  total_amount: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Expense date',
    example: '2022-01-01',
  })
  expense_date?: Date;
}

export class CreateExpenseWithSplitsDto extends CreateExpenseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseSplitDto)
  splits: CreateExpenseSplitDto[];
}

export class CreateExpenseResponseDto {
  @ApiProperty({
    description: 'Expense ID',
    example: 1,
  })
  expense_id: number;
  @ApiProperty({
    description: 'Group ID',
    example: 1,
  })
  group_id: number;
  @ApiProperty({
    description: 'Payer user ID',
    example: 1,
  })
  payer_user_id: number | null;
  @ApiProperty({
    description: 'Description',
    example: 'Groceries',
  })
  description: string | null;
  @ApiProperty({
    description: 'Total amount',
    example: 100,
  })
  total_amount: string;
  @ApiProperty({
    description: 'Expense date',
    example: '2022-01-01',
  })
  expense_date: Date;
  @ApiProperty({
    description: 'Created at',
    example: '2022-01-01',
  })
  created_at: Date;
  @ApiProperty({
    description: 'Updated at',
    example: '2022-01-01',
  })
  updated_at: Date;
}
