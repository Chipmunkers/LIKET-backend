import { PrismaProvider } from 'libs/modules';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { ReviewLike } from '@prisma/client';

@Injectable()
export class ReviewLikeCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT review_like_tb WHERE user_idx = $1 AND review_idx = $2
   *
   * @author jochongs
   *
   * @param userIdx 사용자 식별자
   * @param reviewIdx 리뷰 식별자
   */
  public async selectReviewLike(
    userIdx: number,
    reviewIdx: number,
  ): Promise<ReviewLike | null> {
    return await this.txHost.tx.reviewLike.findUnique({
      where: {
        reviewIdx_userIdx: {
          userIdx,
          reviewIdx,
        },
      },
    });
  }

  /**
   * INSERT review_like_tb
   *
   * @author jochongs
   *
   * @param userIdx 사용자 식별자
   * @param reviewIdx 리뷰 식별자
   */
  public async insertReviewLike(
    userIdx: number,
    reviewIdx: number,
  ): Promise<ReviewLike> {
    return await this.txHost.tx.reviewLike.create({
      data: { userIdx, reviewIdx },
    });
  }

  /**
   * DELETE review_like_tb WHERE user_idx = $1 AND review_idx = $2
   *
   * @author jochongs
   *
   * @param userIdx 사용자 식별자
   * @param reviewIdx 리뷰 식별자
   */
  public async deleteReviewLike(
    userIdx: number,
    reviewIdx: number,
  ): Promise<void> {
    await this.txHost.tx.reviewLike.delete({
      where: {
        reviewIdx_userIdx: {
          userIdx,
          reviewIdx,
        },
      },
    });
  }

  /**
   * UPDATE like_count = like_count + $2 WHERE idx = $1
   *
   * @author jochongs
   *
   * @param reviewIdx 리뷰 식별자
   * @param count 상승 시킬 좋아요 개수
   */
  public async increaseReviewLikeCountByIdx(
    reviewIdx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.review.update({
      where: { idx: reviewIdx, deletedAt: null, User: { deletedAt: null } },
      data: {
        likeCount: {
          increment: count,
        },
      },
    });
  }
}
