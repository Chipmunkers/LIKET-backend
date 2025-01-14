/**
 * @author
 */
export class Stopover {
  /**
   * @example 126.9246033
   */
  x: number;

  /**
   * @example 33.4048969
   */
  y: number;
}

/**
 * @author jochongs
 */
export class GetPedestrianDto {
  /**
   * 출발지 명칭
   *
   * @example "광치기 해변"
   */
  startName: string;

  /**
   * 출발지 X좌표(경도)의 좌푯값
   *
   * @example 126.9246033
   */
  startX: number;

  /**
   * 출발지 Y 좌표(위도)의 좌푯값
   *
   * @example 33.45241976
   */
  startY: number;

  /**
   * 목적지 명칭
   *
   * @example endName
   */
  endName: string;

  /**
   * 목적지 X좌표(경도)의 좌푯값
   *
   * @example 126.9041895
   */
  endX: number;

  /**
   * 출발지 Y 좌표(위도)의 좌푯값
   *
   * @example 33.4048969
   */
  endY: number;

  /**
   * 경유지 정보
   *
   * 5개까지만 입력할 수 있습니다.
   */
  passList: Stopover[];
}
