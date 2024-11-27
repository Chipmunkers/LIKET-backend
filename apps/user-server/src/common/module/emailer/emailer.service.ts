import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Logger } from '../logger/logger.decorator';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class EmailerService {
  constructor(
    private readonly mailerService: MailerService,
    @Logger(EmailerService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 이메일을 보내는 메서드.
   *
   * @author jochongs
   */
  async send(toEmail: string, title: string, contents: string) {
    this.logger.log(this.send, `Send mail to ${toEmail}`);

    await this.mailerService.sendMail({
      to: toEmail,
      subject: title,
      html: contents,
    });
  }
}
