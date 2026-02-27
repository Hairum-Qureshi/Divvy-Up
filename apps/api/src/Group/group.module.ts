import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { PrismaService } from 'src/prisma.service';
import { MailModule } from 'src/Mail/mail.module';
import { BadgeModule } from 'src/Badge/badge.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [GroupController],
  providers: [GroupService, PrismaService],
  imports: [MailModule, BadgeModule, AuthModule]
})
export class GroupModule {}
