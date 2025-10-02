import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  username: string;

  @IsDateString()
  DOB: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsEmail()
  email: string;
}

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
