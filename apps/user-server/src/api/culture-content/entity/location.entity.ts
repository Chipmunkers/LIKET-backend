import { Location } from '@prisma/client';
import { SelectLocationFieldPrisma } from 'apps/user-server/src/api/culture-content/entity/prisma/select-location-field';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { CultureContentLocationModel } from 'libs/core/culture-content/model/culture-content-location.model';

/**
 * @author jochongs
 */
export class LocationEntity {
  /**
   * 자세한 주소
   *
   * @example "LH아파트 1205호"
   */
  @IsString()
  @Length(1, 200)
  @IsOptional()
  public detailAddress: string | null;

  /**
   * 주소
   *
   * @example "전북 익산시 부송동 100"
   */
  @IsString()
  @Length(1, 200)
  public address: string;

  /**
   * 1깊이 리전 명
   *
   * @example 서울
   */
  @IsString()
  @Length(1, 20)
  public region1Depth: string;

  /**
   * 2깊이 리전 명
   *
   * @example 강동구
   */
  @IsString()
  @Length(1, 20)
  public region2Depth: string;

  /**
   * X좌표
   *
   * @example "126.99597295767953"
   */
  @IsNumber()
  public positionX: number;

  /**
   * Y좌표
   *
   * @example "35.97664845766847"
   */
  @IsNumber()
  public positionY: number;

  /**
   * 행정동 코드
   *
   * @example "4514069000"
   */
  @IsString()
  @Length(10, 10)
  public hCode: string;

  /**
   * 법정동 코드
   *
   * @example "4514013400"
   */
  @IsString()
  @Length(10, 10)
  public bCode: string;

  constructor(data: LocationEntity) {
    Object.assign(this, data);
  }

  /**
   * `CultureContentCoreModule`이 만들어짐에따라 deprecated 되었습니다.
   * 대신 fromModel 정적 메서드를 사용하십시오.
   *
   * @deprecated
   */
  static createEntity(location: SelectLocationFieldPrisma) {
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

  public static fromModel(model: CultureContentLocationModel): LocationEntity {
    return new LocationEntity({
      region1Depth: model.region1Depth,
      region2Depth: model.region2Depth,
      detailAddress: model.detailAddress,
      address: model.address,
      positionX: model.positionX,
      positionY: model.positionY,
      hCode: model.hCode,
      bCode: model.bCode,
    });
  }
}
