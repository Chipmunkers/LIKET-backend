/**
 * @author jochongs
 */
export class ClusteredEntity {
  /**
   * 법정동 코드
   *
   * @example "11140115"
   */
  code: string;

  /**
   * 위도
   *
   * @example "126.9821180404302"
   */
  lng: number;

  /**
   * 경도
   *
   * @example "37.56395496893697"
   */
  lat: number;

  /**
   * 해당 법정동에 존재하는 컨텐츠 개수
   *
   * @example 13
   */
  count: number;
}
