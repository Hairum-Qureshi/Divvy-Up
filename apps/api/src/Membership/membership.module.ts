import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { PrismaService } from 'src/prisma.service';
import { BadgeModule } from 'src/Badge/badge.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MembershipController],
  providers: [MembershipService, PrismaService],
  imports: [BadgeModule, AuthModule],
})
export class MembershipModule {}