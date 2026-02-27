import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto, EditMembershipDto } from './membership.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtUser } from 'src/auth/jwt.strategy';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.membershipService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createMembershipDto: CreateMembershipDto) {
    return await this.membershipService.create(createMembershipDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async edit(
    @Param('id') id: string,
    @Body() editMembershipDto: EditMembershipDto,
  ) {
    return await this.membershipService.edit({ ...editMembershipDto, id });
  }

  @Get('user/current/groups')
  @UseGuards(AuthGuard('jwt'))
  async findGroupsForUser(@CurrentUser() auth: JwtUser) {
    return this.membershipService.findGroupsForUser(auth);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.membershipService.delete(id);
  }
}
