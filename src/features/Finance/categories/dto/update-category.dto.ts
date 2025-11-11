import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { category_type } from '../../../../../generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: 'Category name',
    example: 'Groceries',
  })
  name: string;

  @ApiProperty({
    description: 'Category type',
    example: 'expense',
  })
  type: category_type;

  @ApiProperty({
    description: 'Category description',
    example: 'Groceries',
  })
  description: string;

  @ApiProperty({
    description: 'Total budget',
    example: 100,
  })
  total_budget: number;

  @ApiProperty({
    description: 'Amount spent',
    example: 50,
  })
  amount_spent: number;

  @ApiProperty({
    description: 'Amount remaining',
    example: 50,
  })
  amount_remaining: number;
}
