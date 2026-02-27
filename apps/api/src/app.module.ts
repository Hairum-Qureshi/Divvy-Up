import { Module } from '@nestjs/common';


import { AppService } from './app.service';
import { AppController } from './app.controller';

import { ExpenseModule } from './Expense/expense.module';
import { ExpenseSplitModule } from './ExpenseSplit/expensesplit.module';
import { GroupModule } from './Group/group.module';
import { MembershipModule } from './Membership/membership.module';
import { SettlementModule } from './Settlement/settlement.module';
import { UserModule } from './User/user.module';
import { MailModule } from './Mail/mail.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ExpenseModule,
    ExpenseSplitModule,
    GroupModule,
    MembershipModule,
    SettlementModule,
    UserModule,
    MailModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
