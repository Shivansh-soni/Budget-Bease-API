import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateSavingDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  total_savings: number;

  @IsNumber()
  @IsOptional()
  amount_saved: number;

  @IsNumber()
  @IsOptional()
  amount_remaining: number;
}
