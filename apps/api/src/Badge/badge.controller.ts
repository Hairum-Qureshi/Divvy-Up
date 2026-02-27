import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { BadgeService } from './badge.service';


@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}
  @Get('user/:userId')
  async getBadgesForUser(@Param('userId') userId: string) {
    return this.badgeService.getBadgesForUser(userId);
  }
}
