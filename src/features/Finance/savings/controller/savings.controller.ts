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
import { AuthGuard } from '../../../../modules/gaurds/AuthGaurd';
import {
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new saving' })
  @ApiBody({ type: CreateSavingDto })
  @ApiOkResponse({ type: CreateSavingDto })
  create(
    @Body(new ValidationPipe()) createSavingDto: CreateSavingDto,
    @Request() req: any,
  ) {
    return this.savingsService.create(createSavingDto, +req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Find all savings' })
  @ApiOkResponse({ type: [CreateSavingDto] })
  findAll(@Request() req: any) {
    return this.savingsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a saving by ID' })
  @ApiOkResponse({ type: CreateSavingDto })
  @ApiParam({ name: 'id', description: 'ID of the saving' })
  findOne(@Param('id') id: string) {
    return this.savingsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSavingDto: UpdateSavingDto) {
  //   return this.savingsService.update(+id, updateSavingDto);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a saving by ID' })
  @ApiOkResponse({ type: CreateSavingDto })
  @ApiParam({ name: 'id', description: 'ID of the saving' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.savingsService.remove(+id, +req.user.id);
  }
}
