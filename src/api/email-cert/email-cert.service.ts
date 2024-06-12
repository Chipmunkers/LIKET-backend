import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { IEmailCertService } from './interface/IEmailCertService';
import { EmailCertType } from './model/email-cert-type';
import { EmailerService } from '../../common/module/emailer/emailer.service';
import { JwtService } from '@nestjs/jwt';
import { CodeNotFoundException } from './exception/CodeNotFoundException';
import { WrongEmailCertCodeException } from './exception/WrongEmailCertCodeException';
import { EmailJwtPayload } from './model/email-jwt-payload';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class EmailCertService implements IEmailCertService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailerService: EmailerService,
    private readonly jwtService: JwtService,
    @Logger('EmailCertService') private readonly logger: LoggerService,
  ) {}

  sendCertCode: (toEmail: string, type: EmailCertType) => Promise<void> =
    async (toEmail, type) => {
      const randomCode = Math.floor(Math.random() * 10 ** 6)
        .toString()
        .padStart(6, '0');
      this.logger.log('sendCertCode', `Create random code ${randomCode}`);

      this.logger.log('sendCertCode', `Send random code to ${toEmail}`);
      await this.emailerService.send(
        toEmail,
        'Liket 인증번호',
        `<h1>${randomCode}</h1>`,
      );

      this.logger.log('sendCertCode', 'Save random code in RDB');
      await this.prisma.emailCertCode.create({
        data: {
          type,
          email: toEmail,
          code: randomCode,
        },
      });
    };

  checkCertCode: (
    email: string,
    code: string,
    type: EmailCertType,
  ) => Promise<string> = async (email, code, type) => {
    const threeMinuteAgo = new Date();
    threeMinuteAgo.setMinutes(threeMinuteAgo.getMinutes() - 3);

    this.logger.log('checkCertCode', 'try to find random code in RDB');
    const cert = await this.prisma.emailCertCode.findFirst({
      where: {
        email,
        createdAt: {
          gte: threeMinuteAgo,
        },
        type,
      },
    });

    if (!cert) {
      throw new CodeNotFoundException('Cannot find code');
    }

    this.logger.log('checkCertCode', `Found random code ${cert.code}`);
    if (cert.code !== code) {
      throw new WrongEmailCertCodeException('Wrong certification code');
    }

    this.logger.log('checkCertCode', 'Hard-Delete random code in RDB');
    await this.prisma.emailCertCode.deleteMany({
      where: {
        email,
        type,
      },
    });

    return await this.createEmailJwt(email, type);
  };

  private createEmailJwt: (
    email: string,
    type: EmailCertType,
  ) => Promise<string> = async (email, type) => {
    const payload: EmailJwtPayload = {
      email,
      type,
    };

    this.logger.log('createEmailJwt', 'Created email jwt');
    return await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
    });
  };
}
