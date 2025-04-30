/**
 * @author jochongs
 */
export class FindActiveBannerAllInput {
  /** 페이지네이션 번호 (1부터 시작) */
  public readonly page: number;

  /** 한 번에 가져올 데이터 개수 */
  public readonly row: number;
}
