import {
  IsEnum,
  IsHexColor,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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
    example: 'Monthly grocery shopping',
  })
  description: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Total budget',
    example: 1000,
  })
  total_budget: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Amount spent',
    example: 500,
  })
  amount_spent: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Amount remaining',
    example: 500,
  })
  amount_remaining: number;

  // @IsString()
  // @IsOptional()
  // @IsHexColor()
  // @ApiProperty({
  //   description: 'Category color in hex format',
  //   example: '#FF5733',
  // })
  // color: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Icon name or identifier',
    example: 'shopping-cart',
  })
  icon: string;
}
