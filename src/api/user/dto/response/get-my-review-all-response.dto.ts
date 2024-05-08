import { ReviewEntity } from '../../../review/entity/review.entity';

export class GetMyReviewAllResponseDto {
  reviewList: ReviewEntity[];

  /**
   * 검색된 리뷰 개수
   *
   * @example 1
   */
  count: number;
}
