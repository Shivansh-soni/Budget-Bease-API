import { transaction_type } from '../../../../../generated/prisma';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsDateString, IsNumber, IsDecimal, MaxLength, IsUUID } from 'class-validator';

export class BaseTransactionDto {
  @ApiProperty({
    description: 'Category ID for the transaction',
    example: 1,
    required: false
  })
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @ApiProperty({
    description: 'Transaction amount',
    example: '100.50',
    required: true
  })
  @IsDecimal({ decimal_digits: '2' })
  amount: string;

  @ApiProperty({
    description: 'Type of transaction',
    enum: transaction_type,
    enumName: 'TransactionType',
    example: transaction_type.expense
  })
  @IsEnum(transaction_type, {
    message: 'Type must be either "income" or "expense"',
  })
  type: transaction_type;

  @ApiProperty({
    description: 'Savings account ID',
    example: 1,
    required: false
  })
  @IsNumber()
  @IsOptional()
  savings_id?: number;

  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Monthly grocery shopping',
    maxLength: 500,
    required: false
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Name of the payee',
    example: 'Local Supermarket',
    maxLength: 255,
    required: false
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  payee_name?: string;

  @ApiProperty({
    description: 'Type of receipt (e.g., GROCERY, UTILITY, TRANSPORT)',
    example: 'GROCERY',
    maxLength: 50,
    required: false
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  receipt_type?: string;

  @ApiProperty({
    description: 'URL of the receipt image',
    example: 'https://example.com/receipts/123.jpg',
    maxLength: 2048,
    required: false
  })
  @IsString()
  @MaxLength(2048)
  @IsOptional()
  receipt_image_url?: string;

  @ApiProperty({
    description: 'Date of the transaction',
    example: '2023-01-15',
    required: false
  })
  @IsDateString()
  @IsOptional()
  transaction_date?: Date;

  @ApiProperty({
    description: 'Unique identifier from the invoice/receipt',
    example: 'INV-2023-01-001',
    maxLength: 100,
    required: false
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  raw_invoice_id?: string;
}
