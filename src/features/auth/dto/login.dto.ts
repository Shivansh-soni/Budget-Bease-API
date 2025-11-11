import {
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'Email',
    example: 'email',
  })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Username',
    example: 'username',
  })
  username: string;

  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({
    description: 'Password',
    example: 'password',
  })
  password: string;
}
