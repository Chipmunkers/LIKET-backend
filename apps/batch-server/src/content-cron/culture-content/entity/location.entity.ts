/**
 * @author jochongs
 */
export class LocationEntity {
  /**
   * 전체 지번 주소
   *
   * @example "전북 익산시 부송동 100"
   */
  address: string;

  /**
   * 세부 주소
   *
   * @example 건물 2층
   */
  detailAddress?: string;

  /**
   * 지역 1 Depth, 시도 단위
   *
   * @example 전북
   */
  region1Depth: string;

  /**
   * 지역 2 Depth, 구 단위
   *
   * @example 익산시
   */
  region2Depth: string;

  /**
   * 행정 코드
   *
   * @example 4514069000
   */
  hCode: string;

  /**
   * 법정 코드
   *
   * @example 4514013400
   */
  bCode: string;

  /**
   * X 좌표값, 경위도인 경우 경도(longitude)
   *
   * @example "126.99597295767953"
   */
  positionX: number;

  /**
   * Y 좌표값, 경위도인 경우 위도(latitude)
   *
   * @example "35.97664845766847"
   */
  positionY: number;

  constructor(data: LocationEntity) {
    Object.assign(this, data);
  }

  static create(location: LocationEntity) {
    return new LocationEntity(location);
  }
}
