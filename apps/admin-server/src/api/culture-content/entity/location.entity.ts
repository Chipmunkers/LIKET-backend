import { Location } from '@prisma/client';

export class LocationEntity {
  /**
   * 1깊이 지역 이름
   *
   * @example 전북
   */
  public region1Depth: string;

  /**
   * 2깊이 지역 이름
   *
   * @example 익산시
   */
  public region2Depth: string;

  /**
   * 자세한 주소
   *
   * @example "LH아파트 1205호"
   */
  public detailAddress: string;

  /**
   * 주소
   *
   * @example "전북 익산시 부송동 100"
   */
  public address: string;

  /**
   * X좌표
   *
   * @example "126.99597295767953"
   */
  public positionX: number;

  /**
   * Y좌표
   *
   * @example "35.97664845766847"
   */
  public positionY: number;

  /**
   * 행정동 코드
   *
   * @example "4514069000"
   */
  public hCode: string;

  /**
   * 법정동 코드
   *
   * @example "4514013400"
   */
  public bCode: string;

  private constructor(data: LocationEntity) {
    Object.assign(this, data);
  }

  static createEntity(location: Location) {
    return new LocationEntity(location);
  }
}
