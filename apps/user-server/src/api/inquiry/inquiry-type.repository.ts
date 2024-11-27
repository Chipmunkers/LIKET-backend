import { Injectable } from '@nestjs/common';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { Prisma } from '@prisma/client';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class InquiryTypeRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    @Logger(InquiryTypeRepository.name) private readonly logger: LoggerService,
  ) {}

  /**
   * @author jochongs
   */
  public selectInquiryTypeAll(tx?: Prisma.TransactionClient) {
    this.logger.log(this.selectInquiryTypeAll, 'SELECT inquiry');
    return (tx || this.prisma).inquiryType.findMany();
  }

  /**
   * @author jochongs
   */
  public selectInquiryByIdx(idx: number, tx?: Prisma.TransactionClient) {
    this.logger.log(
      this.selectInquiryByIdx,
      `SELECT inquiry WHERE idx = ${idx}`,
    );
    return (tx || this.prisma).inquiryType.findUnique({
      where: {
        idx,
      },
    });
  }
}
