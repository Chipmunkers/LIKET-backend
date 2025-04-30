import { CultureContentLocationSelectField } from 'libs/core/culture-content/model/prisma/culture-content-location-select-field';

/**
 * @author jochongs
 */
export class CultureContentLocationModel {
  /**
   * 지역 식별자
   *
   * ! 주의: 컨텐츠 식별자가 아닙니다.
   */
  public readonly idx: number;

  /**
   * 주소
   */
  public readonly address: string;

  /**
   * 자세한 주소
   */
  public readonly detailAddress: string | null;

  /**
   * 1뎁스 리전명
   *
   * @example "서울"
   */
  public readonly region1Depth: string;

  /**
   * 1뎁스 리전명
   *
   * @example "서울"
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

  /**
   * 시/도 코드 (법정동 코드 앞 2자리)
   */
  public readonly sidoCode: string;

  /**
   * 시/군/구 코드 (시도 코드 다음, 법정동 코드 3자리)
   */
  public readonly sggCode: string;

  /**
   * 읍/면/동 코드 (시군구 코드 다음, 법정동 코드 3자리)
   */
  public readonly legCode: string;

  /**
   * 리 코드 (읍면동 코드 다음, 법정 코드 2자리)
   */
  public readonly riCode: string;

  constructor(data: CultureContentLocationModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    location: CultureContentLocationSelectField,
  ): CultureContentLocationModel {
    return new CultureContentLocationModel({
      idx: location.idx,
      address: location.address,
      detailAddress: location.detailAddress,
      region1Depth: location.region1Depth,
      region2Depth: location.region2Depth,
      hCode: location.hCode,
      bCode: location.bCode,
      positionX: location.positionX,
      positionY: location.positionY,
      sidoCode: location.sidoCode,
      sggCode: location.sggCode,
      legCode: location.legCode,
      riCode: location.riCode,
    });
  }
}
