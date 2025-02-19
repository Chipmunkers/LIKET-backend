import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaProvider } from 'libs/modules';
import { Injectable } from '@nestjs/common';
import { ContentLike } from '@prisma/client';

@Injectable()
export class CultureContentLikeCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT content_like_tb WHERE content_idx = $1 AND user_idx = $2
   *
   * @author jochongs
   * @param idx 컨텐츠 식별자
   * @param userIdx 좋아요 누른 사용자 식별자
   */
  public async selectCultureContentLike(
    idx: number,
    userIdx: number,
  ): Promise<ContentLike | null> {
    return await this.txHost.tx.contentLike.findUnique({
      where: {
        contentIdx_userIdx: {
          contentIdx: idx,
          userIdx,
        },
      },
    });
  }

  /**
   * INSERT content_like_tb
   *
   * @author jochongs
   *
   * @param idx 컨텐츠 식별자
   * @param userIdx 좋아요 누른 사용자 식별자
   */
  public async insertCultureContentLike(
    idx: number,
    userIdx: number,
  ): Promise<void> {
    await this.txHost.tx.contentLike.create({
      data: {
        userIdx,
        contentIdx: idx,
      },
    });
  }

  /**
   * UPDATE like_count = like_count + $2 WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 컨텐츠 식별자
   * @param count 증가할 숫자
   */
  public async increaseCultureContentLikeCountByIdx(
    idx: number,
    count: number = 1,
  ): Promise<void> {
    await this.txHost.tx.cultureContent.update({
      where: { idx, deletedAt: null },
      data: {
        likeCount: { increment: count },
      },
    });
  }

  /**
   * DELETE content_like_tb WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 컨텐츠 식별자
   * @param userIdx 좋아요 취소를 누른 사용자 식별자
   */
  public async deleteCultureContentLike(
    idx: number,
    userIdx: number,
  ): Promise<void> {
    await this.txHost.tx.contentLike.delete({
      where: {
        contentIdx_userIdx: {
          contentIdx: idx,
          userIdx,
        },
      },
    });
  }

  /**
   * UPDATE like_count = like_count - $2 WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 컨텐츠 식별자
   * @param count 뺄 숫자
   */
  public async decreaseCultureContentLikeCountByIdx(
    idx: number,
    count: number = 1,
  ): Promise<void> {
    await this.txHost.tx.cultureContent.update({
      where: { idx, deletedAt: null },
      data: {
        likeCount: { decrement: count },
      },
    });
  }
}
