import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { AlreadyLikeReviewException } from 'apps/user-server/src/api/review/exception/AlreadyLikeReviewException';
import { AlreadyLikedReviewException } from 'libs/core/review/exception/AlreadyLikedReviewException';
import { ReviewNotFoundException } from 'libs/core/review/exception/ReviewNotFoundException';
import { ReviewCoreRepository } from 'libs/core/review/review-core.repository';
import { ReviewLikeCoreRepository } from 'libs/core/review/review-like-core.repository';

@Injectable()
export class ReviewLikeCoreService {
  constructor(
    private readonly reviewCoreRepository: ReviewCoreRepository,
    private readonly reviewLikeCoreRepository: ReviewLikeCoreRepository,
  ) {}

  /**
   * 리뷰 좋아요 추가하기
   *
   * @author jochongs
   *
   * @param userIdx 좋아요를 누른 사용자 식별자
   * @param reviewIdx 리뷰 식별자
   *
   * @throws {ReviewNotFoundException} 404 - 좋아요 누를 리뷰가 존재하지 않는 경우
   * @throws {AlreadyLikeReviewException} 409 - 이미 userIdx 사용자가 reviewIdx 리뷰를 좋아요 누른 경우
   */
  @Transactional()
  public async likeReviewByIdx(
    userIdx: number,
    reviewIdx: number,
  ): Promise<void> {
    const review = await this.reviewCoreRepository.selectReviewByIdx(
      reviewIdx,
      userIdx,
    );

    if (!review) {
      throw new ReviewNotFoundException(reviewIdx);
    }

    const likeState = await this.reviewLikeCoreRepository.selectReviewLike(
      userIdx,
      reviewIdx,
    );

    if (likeState) {
      throw new AlreadyLikedReviewException(userIdx, reviewIdx);
    }

    await this.reviewLikeCoreRepository.insertReviewLike(userIdx, reviewIdx);
    await this.reviewLikeCoreRepository.increaseReviewLikeCountByIdx(
      reviewIdx,
      1,
    );
  }
}
