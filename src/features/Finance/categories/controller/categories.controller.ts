import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { JwtAuthGuard } from '@/features/auth/guards/jwt-auth.guard';
import { ApiOkResponse, ApiOperation, ApiBody } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiOkResponse({ type: CreateCategoryDto })
  @ApiBody({ type: CreateCategoryDto })
  create(
    @Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto,
    @Request() req: any,
  ) {
    return this.categoriesService.create(+req.user.id, createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all categories' })
  @ApiOkResponse({ type: [CreateCategoryDto] })
  findAll(@Request() req: any) {
    return this.categoriesService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a category by ID' })
  @ApiOkResponse({ type: CreateCategoryDto })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiOkResponse({ type: CreateCategoryDto })
  @ApiBody({ type: UpdateCategoryDto })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req: any,
  ) {
    return this.categoriesService.update(req.id, +id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiOkResponse({ type: CreateCategoryDto })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
