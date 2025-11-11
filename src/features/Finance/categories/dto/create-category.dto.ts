import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { category_type } from '../../../../../generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({
    description: 'Category name',
    example: 'Groceries',
  })
  name: string;

  @IsEnum(category_type)
  @ApiProperty({
    description: 'Category type',
    example: 'expense',
  })
  type: category_type;

  @IsString()
  @ApiProperty({
    description: 'Category description',
    example: 'Groceries',
  })
  description: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Total budget',
    example: 100,
  })
  total_budget: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Amount spent',
    example: 50,
  })
  amount_spent: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Amount remaining',
    example: 50,
  })
  amount_remaining: number;
}
