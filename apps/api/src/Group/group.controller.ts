import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto, EditGroupDto } from './group.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtUser } from 'src/auth/jwt.strategy';


@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @CurrentUser() auth: JwtUser,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return await this.groupService.create(auth, createGroupDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async findAll() {
    return await this.groupService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.groupService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async edit(@Param('id') id: string, @Body() editGroupDto: EditGroupDto) {
    return await this.groupService.edit({ ...editGroupDto, id });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('add-member/:groupId')
  async addMember(
    @Param('groupId') groupId: string,
    @Body('memberEmail') memberEmail: string,
  ) {
    return await this.groupService.addMember(groupId, memberEmail);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove-member/:groupId/:memberId')
  async removeMember(
    @Param('groupId') groupId: string,
    @Param('memberId') memberId: string,
  ) {
    return await this.groupService.removeMember(groupId, memberId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.groupService.delete(id);
  }
}
