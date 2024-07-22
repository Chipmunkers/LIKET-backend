import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { InsertEmailCertCodeDao } from './dao/insert-email-cert-code.dao';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { SelectEmailCertCodeDao } from './dao/select-email-cert-code.dao';
import { DeleteEmailCertCodeDao } from './dao/delete-email-cert-code.dao';

@Injectable()
export class EmailCertRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(EmailCertRepository.name) private readonly logger: LoggerService,
  ) {}

  public selectEmailCertCodeByEmail(dao: SelectEmailCertCodeDao) {
    this.logger.log(
      this.selectEmailCertCodeByEmail,
      `SELECT email cert code WHERE email = ${dao.email}`,
    );
    return this.prisma.emailCertCode.findFirst({
      where: {
        email: dao.email,
        createdAt: {
          gte: dao.timeLimit,
        },
        type: dao.type,
      },
    });
  }

  public insertEmailCertCode(dao: InsertEmailCertCodeDao) {
    this.logger.log(this.insertEmailCertCode, 'INSERT email cert code');
    return this.prisma.emailCertCode.create({
      data: {
        type: dao.type,
        email: dao.email,
        code: dao.code,
      },
    });
  }

  public deleteEmailCertCodeByEmail(dao: DeleteEmailCertCodeDao) {
    this.logger.log(
      this.deleteEmailCertCodeByEmail,
      `DELETE email cert code WHERE email = ${dao.email}`,
    );
    return this.prisma.emailCertCode.deleteMany({
      where: {
        email: dao.email,
        type: dao.type,
      },
    });
  }
}
