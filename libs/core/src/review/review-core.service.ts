import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { ReviewModel } from 'libs/core/review/model/review.model';
import { ReviewCoreRepository } from 'libs/core/review/review-core.repository';

@Injectable()
export class ReviewCoreService {
  constructor(private readonly reviewCoreRepository: ReviewCoreRepository) {}

  /**
   * idx를 통해 문화생활컨텐츠를 탐색하는 메서드
   *
   * @author jochongs
   * @param idx 리뷰 식별자
   * @param readUser 조회한 사용자 인덱스
   */
  @Transactional()
  public async findReviewByIdx(
    idx: number,
    readUser?: number,
  ): Promise<ReviewModel | null> {
    const review = await this.reviewCoreRepository.selectReviewByIdx(
      idx,
      readUser,
    );

    return review && ReviewModel.fromPrisma(review);
  }
}
