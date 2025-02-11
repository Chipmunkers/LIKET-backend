import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { Injectable } from '@nestjs/common';
import { Style } from 'libs/core/tag-root/style/constant/style';
import { FindManyStyleInput } from 'libs/core/tag-root/style/input/find-many-style.input';
import { StyleSelectField } from 'libs/core/tag-root/style/model/prisma/style-select-field';

@Injectable()
export class StyleCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT style
   * ! 주의: 대부분의 경우에서, 아래 메서드를 사용할 필요가 없습니다. 대신 STYLE을 사용하십시오.
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
        [orderBy]: order,
      },
    });
  }

  /**
   * SELECT style WHERE idx = $1
   * ! 주의: 대부분의 경우에서, 아래 메서드를 사용할 필요가 없습니다. 대신 STYLE을 사용하십시오.
   *
   * @author jochongs
   */
  public async selectStyleByIdx(idx: Style): Promise<StyleSelectField | null> {
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
