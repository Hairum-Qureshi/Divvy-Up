import { Module } from '@nestjs/common';
import { ExpenseSplitService } from './expensesplit.service';
import { ExpenseSplitController } from './expensesplit.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ExpenseSplitController],
  providers: [ExpenseSplitService, PrismaService],
  imports: [AuthModule],
})
export class ExpenseSplitModule {}