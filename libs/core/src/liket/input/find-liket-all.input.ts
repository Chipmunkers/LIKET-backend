/**
 * @author jochongs
 */
export class FindLiketAllInput {
  /**
   * 페이지 번호 (1부터 시작)
   */
  public readonly page: number;

  /**
   * 한 번에 가져올 개수
   */
  public readonly row: number;

  /**
   * 사용자 필터링
   */
  public readonly userIdx?: number;

  /**
   * 정렬 방식
   *
   * @default "idx"
   */
  public readonly orderBy?: 'idx';

  /**
   * 정렬 순서
   *
   * @default "desc"
   */
  public readonly order?: 'desc' | 'asc';
}
