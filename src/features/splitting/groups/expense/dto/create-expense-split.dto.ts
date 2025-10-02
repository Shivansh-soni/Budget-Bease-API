import { IsBoolean, IsDecimal, IsInt, IsOptional, Min } from 'class-validator';

export class CreateExpenseSplitDto {
  @IsInt()
  @Min(1)
  user_id: number;

  @IsDecimal({ decimal_digits: '2' })
  share_amount: string;

  @IsBoolean()
  @IsOptional()
  is_paid?: boolean;
}

export class CreateExpenseSplitResponseDto {
  split_id: number;
  expense_id: number;
  user_id: number;
  share_amount: string;
  is_paid: boolean;
  created_at: Date;
}
