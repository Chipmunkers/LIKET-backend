import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { AlreadyLikedReviewException } from 'libs/core/review/exception/AlreadyLikedReviewException';
import { ReviewLikeCoreRepository } from 'libs/core/review/review-like-core.repository';

@Injectable()
export class ReviewLikeCoreService {
  constructor(
    private readonly reviewLikeCoreRepository: ReviewLikeCoreRepository,
  ) {}

  /**
   * 리뷰 좋아요 추가하기
   *
   * @author jochongs
   *
   * @param userIdx 좋아요를 누른 사용자 인덱스
   * @param reviewIdx 리뷰 인덱스
   */
  @Transactional()
  public async likeReviewByIdx(
    userIdx: number,
    reviewIdx: number,
  ): Promise<void> {
    const likeReview = await this.reviewLikeCoreRepository.selectReviewLike(
      userIdx,
      reviewIdx,
    );

    if (likeReview) {
      throw new AlreadyLikedReviewException(userIdx, reviewIdx);
    }

    await this.reviewLikeCoreRepository.insertReviewLike(userIdx, reviewIdx);
    await this.reviewLikeCoreRepository.increaseReviewLikeCountByIdx(
      reviewIdx,
      1,
    );
  }
}
