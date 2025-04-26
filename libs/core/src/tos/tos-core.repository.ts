import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { TosSelectField } from 'libs/core/tos/model/prisma/tos-select-field';

@Injectable()
export class TosCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

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
}
