import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data?: T;

  @ApiProperty({
    description: 'Optional message describing the response',
    required: false
  })
  message?: string;

  @ApiProperty({
    description: 'Error message if any',
    required: false
  })
  error?: string;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2023-11-16T10:30:00.000Z'
  })
  timestamp: string;

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
    this.timestamp = new Date().toISOString();
    this.success = partial.success !== false;

    // Set default success message if not provided and operation was successful
    if (this.success && !this.message) {
      this.message = 'Operation completed successfully';
    }
  }
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Array of items' })
  items: T[];

  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}
