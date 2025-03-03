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
   * 라이켓 필터링
   *
   * true: 라이켓이 작성된 리뷰만 보기
   * false: 라이켓이 작성되지 않은 리뷰만 보기
   */
  public readonly isLiketCreated?: boolean;

  /**
   * 리뷰 필터링
   *
   * 해당 리뷰는 제외하고 가져옴
   */
  public readonly withOutReviewList?: number[];

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
   * 활성화된 문화생활컨텐츠의 리뷰만 보기
   *
   * true - 활성화된 문화생활컨텐츠의 리뷰만 보여짐
   * false - 비활성화된 문화생활컨텐츠의 리뷰만 보여짐
   */
  public readonly isOnlyAcceptedCultureContent?: boolean;

  /**
   * 현재 오픈되어있는 문화생활컨텐츠의 리뷰만 보기
   *
   * true - 현재 오픈되어있는 문화생활컨텐츠의 리뷰만 보여짐
   * false - 현재 오픈되어있지 않은 문화생활컨텐츠의 리뷰만 보여짐
   */
  public readonly isOnlyOpenCultureContent?: boolean;

  /**
   * 검색어
   */
  public readonly searchKeyword?: string;
}
