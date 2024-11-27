import { Injectable } from '@nestjs/common';
import { IEmailCertService } from './interface/IEmailCertService';
import { EmailCertType } from './model/email-cert-type';
import { EmailerService } from '../../common/module/emailer/emailer.service';
import { JwtService } from '@nestjs/jwt';
import { CodeNotFoundException } from './exception/CodeNotFoundException';
import { WrongEmailCertCodeException } from './exception/WrongEmailCertCodeException';
import { EmailJwtPayload } from './model/email-jwt-payload';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { EmailCertRepository } from './email-cert.repository';

@Injectable()
export class EmailCertService implements IEmailCertService {
  constructor(
    private readonly emailCertRepository: EmailCertRepository,
    private readonly emailerService: EmailerService,
    private readonly jwtService: JwtService,
    @Logger(EmailCertService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * @author jochongs
   */
  public async sendCertCode(
    toEmail: string,
    type: EmailCertType,
  ): Promise<void> {
    const randomCode = this.generateRandomCode();

    await this.emailerService.send(
      toEmail,
      'Liket 인증번호',
      `<h1>${randomCode}</h1>`,
    );

    await this.emailCertRepository.insertEmailCertCode({
      type,
      email: toEmail,
      code: randomCode,
    });
  }

  /**
   * @author jochongs
   */
  private generateRandomCode() {
    const randomCode = Math.floor(Math.random() * 10 ** 6)
      .toString()
      .padStart(6, '0');
    this.logger.log(
      this.generateRandomCode,
      `Create random code ${randomCode}`,
    );
    return randomCode;
  }

  /**
   * @author jochongs
   */
  async checkCertCode(
    email: string,
    code: string,
    type: EmailCertType,
  ): Promise<string> {
    const threeMinuteAgo = this.generateTimeLimit(3);

    const cert = await this.emailCertRepository.selectEmailCertCodeByEmail({
      email,
      type,
      timeLimit: threeMinuteAgo,
    });

    if (!cert) {
      this.logger.warn(
        this.checkCertCode,
        'Attempt to certificate email not found code',
      );
      throw new CodeNotFoundException('Cannot find code');
    }

    if (cert.code !== code) {
      this.logger.warn(
        this.checkCertCode,
        'Attempt to certificate email with invalid code',
      );
      throw new WrongEmailCertCodeException('Wrong certification code');
    }

    await this.emailCertRepository.deleteEmailCertCodeByEmail({
      email,
      type,
    });

    return await this.createEmailJwt(email, type);
  }

  /**
   * @author jochongs
   */
  private generateTimeLimit(min: number) {
    const threeMinuteAgo = new Date();
    threeMinuteAgo.setMinutes(threeMinuteAgo.getMinutes() - min);
    return threeMinuteAgo;
  }

  /**
   * @author jochongs
   */
  private async createEmailJwt(
    email: string,
    type: EmailCertType,
  ): Promise<string> {
    const payload: EmailJwtPayload = {
      email,
      type,
    };

    this.logger.log(this.createEmailJwt, 'Create email jwt');
    return await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
    });
  }
}
