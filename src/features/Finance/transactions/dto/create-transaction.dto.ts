import {
  IsNumber,
  IsOptional,
  IsDecimal,
  IsEnum,
  IsString,
  IsDateString,
} from 'class-validator';
import { transaction_type } from '../../../../../generated/prisma';
export class CreateTransactionDto {
  @IsNumber()
  @IsOptional() // Make optional to match schema
  category_id?: number;

  @IsNumber() // Consider using a custom decorator for Decimal validation
  amount: string; // Use string for Decimal

  @IsEnum(transaction_type, {
    message: 'Type must be either "income" or "expense"',
  })
  type: transaction_type;

  @IsNumber()
  @IsOptional()
  budget_id: number;

  @IsNumber()
  @IsOptional()
  savings_id: number;

  @IsString()
  @IsOptional() // Make optional to match schema
  description?: string;

  @IsString()
  @IsOptional()
  payee_name?: string;

  @IsString()
  @IsOptional()
  payer_name?: string; // Make optional to match schema

  @IsDateString()
  @IsOptional() // Make optional to match schema
  scanned_at?: Date;

  @IsString()
  @IsOptional()
  receipt_image_url?: string;

  @IsString()
  @IsOptional()
  receipt_type?: string; // Add missing field

  @IsDateString()
  @IsOptional()
  transaction_date?: Date; // Add missing field

  @IsString()
  @IsOptional()
  raw_invoice_id?: string; // Rename from raw_invoice_data to match schema
}
