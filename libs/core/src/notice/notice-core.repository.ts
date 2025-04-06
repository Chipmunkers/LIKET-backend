import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { NoticeSelectField } from 'libs/core/notice/model/prisma/notice-select-field';
import { SummaryNoticeSelectField } from 'libs/core/notice/model/prisma/summary-notice-select-field';
import {
  FindNoticeAllInput,
  FindNoticeOrderByInput,
} from 'libs/core/notice/input/find-notice-all.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class NoticeCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT notice_tb
   *
   * @author jochongs
   */
  public async selectNoticeAll({
    search,
    stateList = [],
    page,
    row,
    orderByList = [],
  }: FindNoticeAllInput): Promise<SummaryNoticeSelectField[]> {
    return await this.txHost.tx.notice.findMany({
      where: {
        deletedAt: null,
        AND: [
          this.getSearchWhereClause(search),
          this.getStateFilterWhereClause(stateList),
        ],
      },
      select: {
        idx: true,
        title: true,
        pinnedAt: true,
        activatedAt: true,
        createdAt: true,
      },
      orderBy: this.getOrderbyFiled(orderByList),
      take: row,
      skip: (page - 1) * row,
    });
  }

  private getSearchWhereClause(search?: string): Prisma.NoticeWhereInput {
    if (!search) {
      return {};
    }

    return {
      title: {
        contains: search,
      },
    };
  }

  private getStateFilterWhereClause(
    stateList: ('active' | 'deactivate' | 'pin')[],
  ): Prisma.NoticeWhereInput {
    if (!stateList.length) return {};

    return {
      AND: [
        stateList.includes('active') ? { activatedAt: { not: null } } : {},
        stateList.includes('deactivate') ? { activatedAt: null } : {},
        stateList.includes('pin') ? { pinnedAt: { not: null } } : {},
      ],
    };
  }

  private getOrderbyFiled(
    orderByList: FindNoticeOrderByInput[],
  ):
    | Prisma.NoticeOrderByWithRelationInput
    | Prisma.NoticeOrderByWithRelationInput[] {
    if (!orderByList.length)
      return {
        idx: 'desc',
      };

    const idxOrder = orderByList.find(({ by }) => by === 'idx')?.order || null;
    const pinOrder = orderByList.find(({ by }) => by === 'pin')?.order || null;

    return [
      idxOrder ? { idx: idxOrder } : {},
      pinOrder ? { pinnedAt: pinOrder } : {},
    ].filter((data) => Object.keys(data).length);
  }

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
