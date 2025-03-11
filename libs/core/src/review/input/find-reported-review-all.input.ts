/**
 * @author jochongs
 */
export class FindReportedReviewAllInput {
  /** 페이지 번호 (1부터 시작) */
  public readonly page: number;

  /** 한 번에 가져올 데이터 개수 */
  public readonly row: number;

  /** 검색할 요소 */
  public readonly searchBy?: ('review' | 'author')[];

  /** 검색 키워드 */
  public readonly search?: string;

  /**
   * 리뷰 신고 상태 필터링
   *
   * true: 삭제 처리가 된 리뷰만 가져오기
   * false: 삭제 처리가 안 된 리뷰만 가져오기
   */
  public readonly state?: boolean;

  /**
   * 정렬 요소
   *
   * firstReportedAt: 신고된 시간 순
   * reportCount: 신고 횟수 순
   * idx: 리뷰 식별자 순
   *
   * @default "firstReportedAt"
   */
  public readonly orderBy?: 'firstReportedAt' | 'reportCount' | 'idx';

  /**
   * 정렬 방식
   *
   * @default "desc"
   */
  public readonly order?: 'asc' | 'desc';
}
