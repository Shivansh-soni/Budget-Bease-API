import { ApiProperty, PickType } from '@nestjs/swagger';
import { BaseTransactionDto } from './base-transaction.dto';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateTransactionDto extends PickType(BaseTransactionDto, [
  'amount',
  'type',
  'category_id',
  'savings_id',
  'description',
  'payee_name',
  'receipt_type',
  'receipt_image_url',
  'transaction_date',
  'raw_invoice_id',
] as const) {
  @ApiProperty({
    description:
      'Payer name (will be set automatically from authenticated user)',
    readOnly: true,
    required: false,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  payer_name?: string;

  @ApiProperty({
    description: 'Timestamp when the receipt was scanned',
    example: '2023-01-15T12:00:00Z',
    required: false,
  })
  @IsOptional()
  scanned_at?: Date;
}
