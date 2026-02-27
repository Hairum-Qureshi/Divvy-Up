import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { MailModule } from 'src/Mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService],
    imports: [MailModule, AuthModule]
})
export class UserModule {}