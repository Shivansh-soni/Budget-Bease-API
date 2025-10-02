import {
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  username: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;
}
