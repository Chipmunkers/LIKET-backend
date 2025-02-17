/**
 * @author jochongs
 */
export class CreateCultureContentLocationInput {
  /** 주소 */
  public readonly address: string;

  /** 세부 주소 */
  public readonly detailAddress?: string;

  /**
   * 1깊이 지역 명
   *
   * @example "서울"
   */
  public readonly region1Depth?: string;

  /**
   * 2깊이 지역 명
   *
   * @example "강동구"
   */
  public readonly region2Depth: string;

  /**
   * 행정동 코드
   */
  public readonly hCode: string;

  /**
   * 법정동 코드
   */
  public readonly bCode: string;

  /**
   * x좌표
   */
  public readonly positionX: number;

  /**
   * y좌표
   */
  public readonly positionY: number;
}
