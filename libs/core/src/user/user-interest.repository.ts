import { PrismaProvider } from 'libs/modules';
import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Genre } from 'libs/core/tag-root/genre/constant/genre';
import { Style } from 'libs/core/tag-root/style/constant/style';

@Injectable()
export class UserInterestCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * INSERT interest_genre_tb
   *
   * @author jochongs
   *
   * @param idx 사용자 식별자
   */
  public async insertInterestGenre(
    idx: number,
    genreList: Genre[],
  ): Promise<void> {
    await this.txHost.tx.interestGenre.createMany({
      data: genreList.map((genreIdx) => ({
        genreIdx,
        userIdx: idx,
      })),
    });
  }

  /**
   * DELETE interest_genre_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 사용자 식별자
   */
  public async deleteInterestGenre(idx: number): Promise<void> {
    await this.txHost.tx.interestGenre.deleteMany({
      where: { userIdx: idx },
    });
  }

  /**
   * INSERT interest_style_tb
   *
   * @author jochongs
   *
   * @param idx 사용자 식별자
   */
  public async insertInterestStyle(
    idx: number,
    styleList: Style[],
  ): Promise<void> {
    await this.txHost.tx.interestStyle.createMany({
      data: styleList.map((styleIdx) => ({
        styleIdx,
        userIdx: idx,
      })),
    });
  }
}
