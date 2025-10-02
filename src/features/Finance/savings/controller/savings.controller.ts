import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { SavingsService } from '../service/savings.service';
import { CreateSavingDto } from '../dto/create-saving.dto';
import { UpdateSavingDto } from '../dto/update-saving.dto';
import { AuthGuard } from '@/modules/gaurds/AuthGaurd';

@UseGuards(AuthGuard)
@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createSavingDto: CreateSavingDto,
    @Request() req: any,
  ) {
    return this.savingsService.create(createSavingDto, +req.user.id);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.savingsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savingsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSavingDto: UpdateSavingDto) {
  //   return this.savingsService.update(+id, updateSavingDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.savingsService.remove(+id, +req.user.id);
  }
}
