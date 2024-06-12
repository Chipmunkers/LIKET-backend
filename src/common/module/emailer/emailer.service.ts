import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailerService {
  constructor(private readonly mailerService: MailerService) {}

  send: (toEmail: string, title: string, contents: string) => Promise<void> =
    async (toEmail, title, contents) => {
      await this.mailerService.sendMail({
        to: toEmail,
        subject: title,
        html: contents,
      });
    };
}
