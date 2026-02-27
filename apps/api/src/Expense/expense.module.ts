import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { PrismaService } from 'src/prisma.service';
import { BadgeModule } from 'src/Badge/badge.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ExpenseController],
  providers: [ExpenseService, PrismaService],
  imports: [BadgeModule, AuthModule],
})
export class ExpenseModule {}
