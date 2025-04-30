import { Injectable } from '@nestjs/common';
import { InsertEmailCertCodeInput } from './input/insert-email-cert-code.input';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { SelectEmailCertCodeInput } from './input/select-email-cert-code.input';
import { DeleteEmailCertCodeInput } from './input/delete-email-cert-code.input';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class EmailCertRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    @Logger(EmailCertRepository.name) private readonly logger: LoggerService,
  ) {}

  /**
   * @author jochongs
   */
  public selectEmailCertCodeByEmail(dao: SelectEmailCertCodeInput) {
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
      orderBy: {
        idx: 'desc',
      },
    });
  }

  /**
   * @author jochongs
   */
  public insertEmailCertCode(dao: InsertEmailCertCodeInput) {
    this.logger.log(this.insertEmailCertCode, 'INSERT email cert code');
    return this.prisma.emailCertCode.create({
      data: {
        type: dao.type,
        email: dao.email,
        code: dao.code,
      },
    });
  }

  /**
   * @author jochongs
   */
  public deleteEmailCertCodeByEmail(dao: DeleteEmailCertCodeInput) {
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
