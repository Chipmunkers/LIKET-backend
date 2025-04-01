import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { Injectable } from '@nestjs/common';
import { AgeSelectField } from 'libs/core/tag-root/age/model/prisma/age-select-field';
import { GetAllAgeInput } from 'libs/core/tag-root/age/input/get-all-age.input';
import { Age } from '@prisma/client';

@Injectable()
export class AgeCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT age
   * ! 주의: 대부분의 경우에서, 아래 메서드를 사용할 필요가 없습니다. 대신 AGE를 사용하십시오.
   *
   * @author jochongs
   */
  public async selectAgeAll({
    order,
    orderBy,
  }: GetAllAgeInput): Promise<AgeSelectField[]> {
    return await this.txHost.tx.age.findMany({
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
   * SELECT age_tb WHERE idx = $1
   *
   * @author jochongs
   */
  public async selectAgeByIdx(idx: number): Promise<AgeSelectField | null> {
    return await this.txHost.tx.age.findUnique({
      select: {
        idx: true,
        name: true,
        createdAt: true,
      },
      where: { idx },
    });
  }
}
