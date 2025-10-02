import {
  IsString,
  IsOptional,
  MaxLength,
  IsInt,
  Min,
  IsNumber,
} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class AddMembersDto {
  @IsNumber()
  member_id: number;

  @IsNumber()
  group_id: number;
}
