import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BadgeService } from './badge.service';
import { BadgeController } from './badge.controller';

@Module({
  providers: [BadgeService, PrismaService],
  controllers: [BadgeController],
  exports: [BadgeService], 
})
export class BadgeModule {}
