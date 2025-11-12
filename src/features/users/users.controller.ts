import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateAuthDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  profile(@Request() req: any) {
    return this.usersService.showProfile(req.user.id);
  }

  @Patch('/profile/:id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    if (!updateUserDto || !id) {
      throw new BadRequestException('kindly provide user details');
    }
    try {
      return this.usersService.update(+id, updateUserDto);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete('/profile/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
