import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { Injectable } from '@nestjs/common';
import { FindManyGenreInput } from 'libs/core/tag-root/genre/input/find-many-genre.input';
import { GenreSelectField } from 'libs/core/tag-root/genre/model/prisma/genre-select-field';
import { Genre } from 'libs/core/tag-root/genre/constant/genre';

@Injectable()
export class GenreCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT genre
   * ! 주의: 대부분의 경우에서 아래 메서드를 사용할 이유가 없습니다. 대신 GENRE를 사용하십시오.
   *
   * @author jochongs
   */
  public async selectGenreAll({
    order,
    orderBy,
  }: FindManyGenreInput): Promise<GenreSelectField[]> {
    return await this.txHost.tx.genre.findMany({
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
   * SELECT genre WHERE idx = $1
   * ! 주의: 대부분의 경우에서 아래 메서드를 사용할 이유가 없습니다. 대신 GENRE를 사용하십시오.
   *
   * @author jochongs
   */
  public async selectGenreByIdx(idx: Genre): Promise<GenreSelectField | null> {
    return await this.txHost.tx.genre.findUnique({
      select: {
        idx: true,
        name: true,
        createdAt: true,
      },
      where: { idx, deletedAt: null },
    });
  }
}
