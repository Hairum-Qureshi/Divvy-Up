import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UnauthorizedException,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, EditUserDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtUser } from 'src/auth/jwt.strategy';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Delete('settings/delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteUserAccount(@CurrentUser() auth: JwtUser) {
    if (!auth || !auth.userId) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.getUserById(auth.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await this.userService.deleteUserAccount(auth.userId);
  }

  @Patch('settings/update')
  @UseGuards(AuthGuard('jwt'))
  async updateUserSettings(
    @CurrentUser() auth: JwtUser,
    @Body() body: EditUserDto,
  ) {
    if (!auth || !auth.userId) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.getUserById(auth.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await this.userService.updateUserSettings(auth.userId, body);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@CurrentUser() auth: JwtUser) {
    if (!auth || !auth.userId) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.getUserById(auth.userId);
    // console.log(user);
    if (!user) {
      throw new Error('User not found');
    }
    // Return only what your client needs (include the DB id!)
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async edit(@Param('id') id: string, @Body() editUserDto: EditUserDto) {
    return await this.userService.edit({ ...editUserDto, id });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
