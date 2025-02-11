import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { FindManyStyleInput } from 'libs/core/tag-root/style/input/find-many-style.input';
import { StyleSelectField } from 'libs/core/tag-root/style/model/prisma/style-select-field';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class StyleCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT style
   *
   * @author jochongs
   */
  public async selectStyleAll({
    orderBy,
    order,
  }: FindManyStyleInput): Promise<StyleSelectField[]> {
    return await this.txHost.tx.style.findMany({
      select: {
        idx: true,
        name: true,
        createdAt: true,
      },
      where: { deletedAt: null },
      orderBy: {
        [order]: orderBy,
      },
    });
  }

  /**
   * SELECT style WHERE idx = $1
   *
   * @author jochongs
   */
  public async selectStyleByIdx(idx: number): Promise<StyleSelectField | null> {
    return await this.txHost.tx.style.findUnique({
      select: {
        idx: true,
        name: true,
        createdAt: true,
      },
      where: { idx, deletedAt: null },
    });
  }
}
