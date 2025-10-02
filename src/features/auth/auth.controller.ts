import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Get()
  // healthCheck(): object {
  //   return {
  //     status: 'ok',
  //     message: 'Budget Beast is running',
  //     uptime: Math.round(process.uptime()),
  //   };
  // }

  @Post('register')
  create(@Body(new ValidationPipe()) createAuthDto: CreateAuthDto) {
    try {
      return this.authService.create(createAuthDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post('login')
  login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }
}
