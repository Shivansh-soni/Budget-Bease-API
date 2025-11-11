import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class CreateAuthDto {
  @IsString()
  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  first_name: string;

  @IsString()
  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  last_name: string;

  @IsString()
  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  username: string;

  @IsDateString()
  @ApiProperty({
    description: 'Date of birth',
    example: '2000-01-01',
  })
  DOB: string;

  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({
    description: 'Password',
    example: 'password',
  })
  password: string;

  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'johndoe@gmail.com',
  })
  email: string;
}

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Access token',
    example: 'access_token',
  })
  access_token: string;

  @ApiProperty({
    description: 'Refresh token',
    example: 'refresh_token',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'User',
    example: 'user',
  })
  user: User;
}
