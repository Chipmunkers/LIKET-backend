/**
 * @author jochongs
 */
export const REVIEW_REPORT_TYPE = {
  /** 컨텐츠와 무관한 내용 게시 */
  UNRELATED_CONTENT: 1,
  /** 개인정보 노출 위험 */
  PERSONAL_INFORMATION_RISK: 2,
  /** 욕설, 음란 등 부적절한 내용 게시 */
  INAPPROPRIATE_CONTENT: 3,
  /** 이미지 도용, 사칭, 저작권 지식재산권 침해 */
  COPYRIGHT_INFRINGEMENT: 4,
  /** 기타 */
  ETC: 5,
} as const;

export type ReviewReportType =
  (typeof REVIEW_REPORT_TYPE)[keyof typeof REVIEW_REPORT_TYPE];
