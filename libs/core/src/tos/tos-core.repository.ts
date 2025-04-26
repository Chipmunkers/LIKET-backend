import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { TosSelectField } from 'libs/core/tos/model/prisma/tos-select-field';
import { FindTosAllInput } from 'libs/core/tos/input/find-tos-all.input';
import { SummaryTosSelectField } from 'libs/core/tos/model/prisma/summary-tos-select-field';
import { Prisma } from '@prisma/client';
import { CreateTosInput } from 'libs/core/tos/input/create-tos.input';

@Injectable()
export class TosCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT tos_tb
   *
   * @author jochongs
   */
  public async selectTosAll({
    page,
    row,
    order = 'desc',
    orderBy = 'idx',
  }: FindTosAllInput): Promise<SummaryTosSelectField[]> {
    return await this.txHost.tx.tos.findMany({
      select: {
        idx: true,
        title: true,
        isEssential: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        deletedAt: null,
      },
      orderBy: this.getOrderByField(orderBy, order),
      take: row,
      skip: (page - 1) * row,
    });
  }

  /**
   * @author jochongs
   */
  private getOrderByField(
    orderBy: 'idx',
    order: 'desc' | 'asc',
  ): Prisma.TosOrderByWithRelationInput {
    // orderBy === "idx"
    return {
      idx: order,
    };
  }

  /**
   * SELECT tos_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 약관 식별자
   */
  public async selectTosByIdx(idx: number): Promise<TosSelectField | null> {
    return await this.txHost.tx.tos.findUnique({
      select: {
        idx: true,
        title: true,
        contents: true,
        isEssential: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  /**
   * INSERT tos_tb
   *
   * @author jochongs
   */
  public async insertTos(input: CreateTosInput): Promise<TosSelectField> {
    return await this.txHost.tx.tos.create({
      select: {
        idx: true,
        title: true,
        contents: true,
        isEssential: true,
        createdAt: true,
        updatedAt: true,
      },
      data: {
        title: input.title,
        contents: input.contents,
        isEssential: input.isEssential,
      },
    });
  }
}
