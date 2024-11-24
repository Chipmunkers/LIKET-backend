import { ReviewEntity } from '../../../review/entity/review.entity';

export class GetReviewAllResponseDto {
  reviewList: ReviewEntity[];

  /**
   * 검색된 리뷰 총 개수
   *
   * @example 12
   */
  count: number;
}
