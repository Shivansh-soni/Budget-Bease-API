import {
  IsNumber,
  IsOptional,
  IsDecimal,
  IsEnum,
  IsString,
  IsDateString,
  IsNumberString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { transaction_type } from '../../../../../generated/prisma';
export class CreateTransactionDto {
  @IsNumber()
  @IsOptional() // Make optional to match schema
  @ApiProperty({
    description: 'Category ID',
    example: 1,
  })
  category_id?: number;

  @IsNumberString() // Consider using a custom decorator for Decimal validation
  @ApiProperty({
    description: 'Amount',
    example: 100,
  })
  amount: string; // Use string for Decimal

  @IsEnum(transaction_type, {
    message: 'Type must be either "income" or "expense"',
  })
  type: transaction_type;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Budget ID',
    example: 1,
  })
  budget_id: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Savings ID',
    example: 1,
  })
  savings_id: number;

  @IsString()
  @IsOptional() // Make optional to match schema
  @ApiProperty({
    description: 'Description',
    example: 'Groceries',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Payee name',
    example: 'Groceries',
  })
  payee_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Payer name',
    example: 'Groceries',
  })
  payer_name?: string; // Make optional to match schema

  @IsDateString()
  @IsOptional() // Make optional to match schema
  @ApiProperty({
    description: 'Scanned at',
    example: '2022-01-01',
  })
  scanned_at?: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Receipt image URL',
    example: 'https://example.com/receipt.jpg',
  })
  receipt_image_url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Receipt type',
    example: 'Groceries',
  })
  receipt_type?: string; // Add missing field

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Transaction date',
    example: '2022-01-01',
  })
  transaction_date?: Date; // Add missing field

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Raw invoice ID',
    example: '123456789',
  })
  raw_invoice_id?: string; // Rename from raw_invoice_data to match schema
}
