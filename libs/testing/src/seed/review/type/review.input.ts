/**
 * @author jochongs
 */
export type ReviewInput = {
  /** 작성자 인덱스 */
  userIdx: number;

  /** 컨텐츠 인덱스 */
  contentIdx: number;

  /** 별점 */
  starRating?: number;

  /**
   * 리뷰 이미지
   *
   * @default 랜덤 문자열 배열
   */
  imgList?: string[];

  /**
   * 신고 수
   *
   * @default 0
   */
  reportCount?: number;

  /**
   * 좋아요 수
   *
   * @default 0
   */
  likeCount?: number;

  /**
   * 리뷰 내용
   *
   * @default 랜덤 문자열
   */
  description?: string;

  /**
   * 방문 날짜
   *
   * @default 랜덤 날짜
   */
  visitTime?: Date;

  /**
   * 삭제 날짜
   *
   * @default null
   */
  deletedAt?: Date | null;

  /**
   * 최초 신고 일
   *
   * @defualt null
   */
  firstReportedAt?: Date | null;
};
