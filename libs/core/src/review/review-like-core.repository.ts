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
}
