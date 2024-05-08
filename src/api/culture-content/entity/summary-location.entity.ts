import { Location } from '@prisma/client';

export class SummaryLocationEntity {
  /**
   * 1깊이 리전 명
   *
   * @example 서울
   */
  public region1Depth: string;

  /**
   * 2깊이 리전 명
   *
   * @example 강동구
   */
  public region2Depth: string;

  constructor(data: SummaryLocationEntity) {
    Object.assign(this, data);
  }

  static createEntity(data: Location) {
    return new SummaryLocationEntity({
      region1Depth: data.region1Depth,
      region2Depth: data.region2Depth,
    });
  }
}
