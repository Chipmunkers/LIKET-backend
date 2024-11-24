export class ReviewReportTypeEntity {
  /**
   * 리뷰 신고 유형 인덱스
   *
   * @example 3
   */
  idx: number;

  /**
   * 리뷰 신고 유형 이름
   *
   * @example "해당 예시는 실제 데이터와 다를 수 있습니다. 꼭 스키마를 참고해주세요."
   */
  name: string;

  /**
   * 신고 개수
   *
   * @example 4
   */
  count: number;

  constructor() {}
}
