import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { NoticeSelectField } from 'libs/core/notice/model/prisma/notice-select-field';

@Injectable()
export class NoticeCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT notice_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 공지사항 식별자
   */
  public async selectNoticeByIdx(
    idx: number,
  ): Promise<NoticeSelectField | null> {
    return await this.txHost.tx.notice.findUnique({
      select: {
        idx: true,
        title: true,
        contents: true,
        pinnedAt: true,
        activatedAt: true,
        createdAt: true,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }
}
