import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { BaseTransactionDto } from './base-transaction.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTransactionDto extends PartialType(
  PickType(BaseTransactionDto, [
    'amount',
    'category_id',
    'savings_id',
    'description',
    'payee_name',
    'receipt_type',
    'receipt_image_url',
    'transaction_date',
    'raw_invoice_id',
  ] as const),
) {
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
