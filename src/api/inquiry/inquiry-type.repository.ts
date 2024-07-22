import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InquiryTypeRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(InquiryTypeRepository.name) private readonly logger: LoggerService,
  ) {}

  public selectInquiryTypeAll(tx?: Prisma.TransactionClient) {
    this.logger.log(this.selectInquiryTypeAll, 'SELECT inquiry');
    return (tx || this.prisma).inquiryType.findMany();
  }

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
