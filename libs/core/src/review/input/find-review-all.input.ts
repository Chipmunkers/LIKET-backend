/**
 * @author jochongs
 */
export class FindReviewAllInput {
  /**
   * 페이지네이션 번호 (1부터 시작)
   */
  public readonly page: number;

  /**
   * 한 번에 가져올 데이터 개수
   */
  public readonly row: number;

  /**
   * 사용자 인덱스
   */
  public readonly userIdx?: number;

  /**
   * 문화생활컨텐츠 필터링
   */
  public readonly cultureContentIdx?: number;

  /**
   * 정렬 순서
   *
   * @default "desc"
   */
  public readonly order?: 'desc' | 'asc';

  /**
   * 정렬 방식
   *
   * time - 생성된 시간 순서대로
   * like - 좋아요 순서대로
   *
   * @default "time"
   */
  public readonly orderBy?: 'time' | 'like';

  /**
   * 검색 방식
   *
   * @default []
   */
  public readonly searchByList?: ('content' | 'user')[];

  /**
   * 검색어
   */
  public readonly searchKeyword?: string;
}
