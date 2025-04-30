/**
 * @author jochongs
 */
export class CreateReviewInput {
  /** 별점 */
  public readonly starRating: number;

  /** 방문 시간 */
  public readonly visitTime: Date;

  /** 이미지 목록 */
  public readonly imgList: string[];

  /** 리뷰 내용 */
  public readonly description: string;
}
