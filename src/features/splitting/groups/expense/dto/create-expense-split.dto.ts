import { IsBoolean, IsDecimal, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseSplitDto {
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  user_id: number;

  @IsDecimal({ decimal_digits: '2' })
  @ApiProperty({
    description: 'Share amount',
    example: 100,
  })
  share_amount: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Is paid',
    example: false,
  })
  is_paid?: boolean;
}

export class CreateExpenseSplitResponseDto {
  @ApiProperty({
    description: 'Split ID',
    example: 1,
  })
  split_id: number;
  @ApiProperty({
    description: 'Expense ID',
    example: 1,
  })
  expense_id: number;
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  user_id: number;
  @ApiProperty({
    description: 'Share amount',
    example: 100,
  })
  share_amount: string;
  @ApiProperty({
    description: 'Is paid',
    example: false,
  })
  is_paid: boolean;

  @ApiProperty({
    description: 'Created at',
    example: '2022-01-01',
  })
  created_at: Date;
}
