import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { InquiryType } from '@prisma/client';

@Injectable()
export class InquiryTypeCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT inquiry_type_tb
   *
   * !주의 : 대신 INQUIRY_TYPE 을 사용하십시오.
   *
   * @author jochongs
   */
  public async selectInquiryTypeAll(): Promise<InquiryType[]> {
    return await this.txHost.tx.inquiryType.findMany({
      orderBy: {
        idx: 'asc',
      },
    });
  }

  /**
   * SELECT inquiry_type_tb WHERE idx = $1
   *
   * @author jochongs
   */
  public async selectInquiryTypeByIdx(
    idx: number,
  ): Promise<InquiryType | null> {
    return await this.txHost.tx.inquiryType.findUnique({
      where: {
        idx,
      },
    });
  }
}
