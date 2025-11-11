import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSavingDto {
  @IsString()
  @ApiProperty({
    description: 'Saving name',
    example: 'Groceries',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Saving description',
    example: 'Groceries',
  })
  description: string;

  @IsNumber()
  @ApiProperty({
    description: 'Total savings',
    example: 100,
  })
  total_savings: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Amount saved',
    example: 50,
  })
  amount_saved: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Amount remaining',
    example: 50,
  })
  amount_remaining: number;
}
