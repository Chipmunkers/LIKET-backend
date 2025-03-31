import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { InquirySelectField } from 'libs/core/inquiry/model/prisma/inquiry-select-field';

@Injectable()
export class InquiryCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT inquiry_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 문의 식별자
   */
  public async selectInquiryByIdx(
    idx: number,
  ): Promise<InquirySelectField | null> {
    return await this.txHost.tx.inquiry.findUnique({
      select: {
        idx: true,
        title: true,
        contents: true,
        createdAt: true,
        InquiryType: {
          select: {
            idx: true,
            name: true,
          },
        },
        InquiryImg: {
          select: {
            idx: true,
            imgPath: true,
            createdAt: true,
          },
          orderBy: { idx: 'asc' },
          where: { deletedAt: null },
        },
        User: {
          select: {
            idx: true,
            nickname: true,
            email: true,
            profileImgPath: true,
          },
        },
        Answer: {
          select: {
            idx: true,
            contents: true,
            createdAt: true,
          },
        },
      },
      where: {
        idx,
        deletedAt: null,
        User: { deletedAt: null },
      },
    });
  }
}
