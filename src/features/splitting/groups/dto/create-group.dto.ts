import {
  IsString,
  IsOptional,
  MaxLength,
  IsInt,
  Min,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @IsString()
  @MaxLength(100)
  @ApiProperty({
    description: 'Group name',
    example: 'Groceries',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Group description',
    example: 'Groceries',
  })
  description?: string;
}

export class AddMembersDto {
  @IsNumber()
  @ApiProperty({
    description: 'Member ID',
    example: 1,
  })
  member_id: number;

  @IsNumber()
  @ApiProperty({
    description: 'Group ID',
    example: 1,
  })
  group_id: number;
}
