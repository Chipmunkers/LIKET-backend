/**
 * @author jochongs
 */
export class FindTosAllInput {
  /** 페이지네이션 번호 (1부터 시작) */
  public page: number;

  /** 한 번에 가져올 데이터 개수 */
  public row: number;

  /**
   * 정렬 방법
   *
   * @default "idx"
   */
  public orderBy?: 'idx';

  /**
   * 정렬 순서
   *
   * @default "desc"
   */
  public order?: 'desc' | 'asc';
}
