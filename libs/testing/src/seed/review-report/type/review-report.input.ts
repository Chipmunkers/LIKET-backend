import { ReviewReportType } from 'libs/common';

/**
 * @author jochongs
 */
export type ReviewReportInput = {
  /** 리뷰 인덱스 */
  reviewIdx: number;

  /** 신고자 인덱스 */
  userIdx: number;

  /**
   * 리뷰 신고 유형 인덱스
   *
   * @default "랜덤 신고 유형 인덱스"
   */
  typeIdx?: ReviewReportType;

  /**
   * 삭제 일
   *
   * @default null
   */
  deletedAt?: Date | null;
};
