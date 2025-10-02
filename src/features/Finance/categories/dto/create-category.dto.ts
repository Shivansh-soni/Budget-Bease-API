import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { category_type } from '../../../../../generated/prisma';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsEnum(category_type)
  type: category_type;

  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  total_budget: number;

  @IsNumber()
  @IsOptional()
  amount_spent: number;

  @IsNumber()
  @IsOptional()
  amount_remaining: number;
}
