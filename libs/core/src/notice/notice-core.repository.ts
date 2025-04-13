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
import { CreateNoticeInput } from 'libs/core/notice/input/create-notice.input';
import { UpdateNoticeInput } from 'libs/core/notice/input/update-notice.input';

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
    if (!orderByList.length) {
      return { idx: 'desc' };
    }

    return orderByList.map(
      ({ by, order }): Prisma.NoticeOrderByWithRelationInput => {
        if (by === 'idx') {
          return {
            idx: order,
          };
        }

        if (by === 'activated') {
          return {
            activatedAt: order,
          };
        }

        // pin
        return {
          pinnedAt: {
            sort: order,
            nulls: 'last',
          },
        };
      },
    );
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

  /**
   * INSERT notice_tb
   *
   * @author jochongs
   */
  public async insertNotice(
    input: CreateNoticeInput,
  ): Promise<NoticeSelectField> {
    return await this.txHost.tx.notice.create({
      select: {
        idx: true,
        title: true,
        contents: true,
        pinnedAt: true,
        activatedAt: true,
        createdAt: true,
      },
      data: {
        title: input.title,
        contents: input.contents,
      },
    });
  }

  /**
   * UPDATE notice_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 수정할 공지사항 식별자
   */
  public async updateNoticeByIdx(
    idx: number,
    input: UpdateNoticeInput,
  ): Promise<void> {
    await this.txHost.tx.notice.update({
      where: {
        idx,
        deletedAt: null,
      },
      data: {
        title: input.title,
        contents: input.contents,
      },
    });
  }

  /**
   * SOFT DELETE notice_tb WHERE idx = $!
   *
   * @author jochongs
   *
   * @param idx 삭제할 공지사항 식별자
   */
  public async softDeleteNoticeByIdx(idx: number): Promise<void> {
    await this.txHost.tx.notice.update({
      where: {
        idx,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * UPDATE notice_tb SET activated_at = $2 WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 업데이트할 공지사항 식별자
   * @param date 활성화 날짜
   */
  public async updateNoticeActivatedAtByIdx(
    idx: number,
    date: Date | null,
  ): Promise<void> {
    await this.txHost.tx.notice.update({
      where: {
        idx,
        deletedAt: null,
      },
      data: {
        activatedAt: date,
      },
    });
  }

  /**
   * UPDATE notice_tb SET pinned_at = $2 WHERE idx = $!
   *
   * @author jochongs
   *
   * @param idx 업데이트할 공지사항 식별자
   * @param date 고정 날짜
   */
  public async updateNoticePinnedAtByIdx(
    idx: number,
    date: Date | null,
  ): Promise<void> {
    await this.txHost.tx.notice.update({
      where: { idx, deletedAt: null },
      data: {
        pinnedAt: date,
      },
    });
  }
}
