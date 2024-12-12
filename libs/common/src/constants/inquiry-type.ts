/**
 * @author jochongs
 */
export const INQUIRY_TYPE = {
  /** 이용 문의 */
  USAGE_INQUIRY: 1,
  /** 오류 신고 */
  ERROR_REPORT: 2,
  /** 서비스 제안 */
  SERVICE_SUGGESTION: 3,
  /** 기타 */
  ETC: 4,
} as const;

export type InquiryType = (typeof INQUIRY_TYPE)[keyof typeof INQUIRY_TYPE];
