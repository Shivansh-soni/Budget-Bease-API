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
import { GroupsService } from '../service/groups.service';
import { CreateGroupDto, AddMembersDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { AuthGuard } from '@/modules/gaurds/AuthGaurd';

@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createGroupDto: CreateGroupDto,
    @Request() req: any,
  ) {
    return this.groupsService.create(createGroupDto, req.user.id);
  }

  @Post('/add-member')
  addMember(
    @Body(new ValidationPipe()) addMembersDto: AddMembersDto,
    @Request() req: any,
  ) {
    const group_id = addMembersDto.group_id;
    const user_id = addMembersDto.member_id;
    return this.groupsService.addMember(+group_id, +user_id);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.groupsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.groupsService.findOne(+id, req.user.id);
  }

  @Get('/balance/:id')
  balance(@Param('id') id: string) {
    return this.groupsService.balance(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateGroupDto: UpdateGroupDto,
    @Request() req: any,
  ) {
    return this.groupsService.update(+id, updateGroupDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.groupsService.remove(+id, req.user.id);
  }
}
