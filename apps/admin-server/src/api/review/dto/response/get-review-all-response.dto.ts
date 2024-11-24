import { ReviewEntity } from '../../entity/review.entity';

export class GetReviewAllResponseDto {
  reviewList: ReviewEntity[];

  /**
   * 검색된 리뷰 개수
   *
   * @example 94
   */
  count: number;
}
