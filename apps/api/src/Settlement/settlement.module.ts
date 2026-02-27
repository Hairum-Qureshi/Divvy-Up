import { Module } from '@nestjs/common';
import { SettlementService } from './settlement.service';
import { SettlementController } from './settlement.controller';
import { PrismaService } from 'src/prisma.service';
import { BadgeModule } from 'src/Badge/badge.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [SettlementController],
    providers: [SettlementService, PrismaService],
    imports: [BadgeModule, AuthModule],
})
export class SettlementModule {}