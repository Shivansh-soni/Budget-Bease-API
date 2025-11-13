import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsHexColor, IsOptional, IsString } from 'class-validator';
import { category_type } from '../../../../../generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Category name',
    example: 'Groceries',
    required: false,
  })
  name?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Category type',
    example: 'expense',
    required: false,
  })
  type?: category_type;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Category description',
    example: 'Monthly grocery shopping',
    required: false,
  })
  description?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Total budget',
    example: 1000,
    required: false,
  })
  total_budget?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Amount spent',
    example: 500,
    required: false,
  })
  amount_spent?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Amount remaining',
    example: 500,
    required: false,
  })
  amount_remaining?: number;

  @IsString()
  @IsOptional()
  @IsHexColor()
  @ApiProperty({
    description: 'Category color in hex format',
    example: '#FF5733',
    required: false,
  })
  color?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Icon name or identifier',
    example: 'shopping-cart',
    required: false,
  })
  icon?: string;
}
