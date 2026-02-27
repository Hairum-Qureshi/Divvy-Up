import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendEmailDTO } from './email.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-invite-notif-email')
  async create(@Body() sendEmailDTO: SendEmailDTO) {
    return await this.mailService.sendEmail(sendEmailDTO);
  }
}
