import { Location } from '@prisma/client';
import { SummaryLocationEntity } from './summary-location.entity';

export class LocationEntity extends SummaryLocationEntity {
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

  constructor(data: LocationEntity) {
    super(data);
    Object.assign(this, data);
  }

  static createEntity(location: Location) {
    return new LocationEntity({
      region1Depth: location.region1Depth,
      region2Depth: location.region2Depth,
      detailAddress: location.detailAddress,
      address: location.address,
      positionX: location.positionX,
      positionY: location.positionY,
      hCode: location.hCode,
      bCode: location.bCode,
    });
  }
}
