import { ApiProperty } from '@nestjs/swagger';
import { transaction_type } from '../../../../../generated/prisma';

export class Transaction {
  @ApiProperty({
    description: 'Unique identifier of the transaction',
    example: 1,
  })
  id: number;

  // This will be mapped from transaction_id in the service
  @ApiProperty({ description: 'Database ID of the transaction', example: 1 })
  transaction_id: number;

  @ApiProperty({
    description: 'Amount of the transaction',
    example: '100.50',
    type: String,
  })
  amount: string;

  @ApiProperty({
    description: 'Type of the transaction',
    enum: transaction_type,
    example: transaction_type.expense,
  })
  type: transaction_type;

  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Grocery shopping at Walmart',
    required: false,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Date when the transaction occurred',
    example: '2023-05-15T10:30:00.000Z',
  })
  transaction_date: Date;

  @ApiProperty({
    description: 'ID of the user who made the transaction',
    example: 123,
  })
  user_id: number;

  @ApiProperty({
    description: 'ID of the category this transaction belongs to',
    example: 5,
    required: false,
    nullable: true,
  })
  category_id?: number | null;

  @ApiProperty({
    description:
      'ID of the savings account this transaction is associated with',
    example: 3,
    required: false,
    nullable: true,
  })
  savings_id?: number | null;

  @ApiProperty({
    description: 'Name of the payee',
    example: 'Walmart',
    required: false,
    nullable: true,
  })
  payee_name?: string | null;

  @ApiProperty({
    description: 'Type of receipt (e.g., GROCERY, UTILITY, etc.)',
    example: 'GROCERY',
    required: false,
    nullable: true,
  })
  receipt_type?: string | null;

  @ApiProperty({
    description: 'URL to the receipt image',
    example: 'https://example.com/receipts/123.jpg',
    required: false,
    nullable: true,
  })
  receipt_image_url?: string | null;

  @ApiProperty({
    description: 'Original invoice/receipt ID from the source',
    example: 'INV-2023-001',
    required: false,
    nullable: true,
  })
  raw_invoice_id?: string | null;

  @ApiProperty({
    description: 'Timestamp when the receipt was scanned',
    example: '2023-05-15T10:35:00.000Z',
    required: false,
    nullable: true,
  })
  scanned_at?: Date | null;

  @ApiProperty({
    description: 'Timestamp when the transaction was created',
    example: '2023-05-15T10:35:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the transaction was last updated',
    example: '2023-05-15T10:35:00.000Z',
  })
  updated_at: Date;

}
