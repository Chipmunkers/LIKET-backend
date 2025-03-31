import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { InquiryAnswerSelectField } from 'libs/core/inquiry/model/prisma/inquiry-answer-select-field';

@Injectable()
export class InquiryAnswerCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT answer_tb WHERE idx = $1
   *
   * @author jochongs
   */
  public async selectAnswerByIdx(
    idx: number,
  ): Promise<InquiryAnswerSelectField | null> {
    return await this.txHost.tx.answer.findUnique({
      select: {
        idx: true,
        contents: true,
        createdAt: true,
      },
      where: {
        idx,
        deletedAt: null,
        Inquiry: { deletedAt: null, User: { deletedAt: null } },
      },
    });
  }
}
