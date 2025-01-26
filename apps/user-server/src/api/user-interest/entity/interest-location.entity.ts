import { InterestLocation } from '@prisma/client';

/**
 * @author jochongs
 */
export class InterestLocationEntity {
  /**
   * 법정동 코드
   *
   * @example "11"
   */
  bCode: string;

  constructor(data: InterestLocationEntity) {
    Object.assign(this, data);
  }

  static createEntity(location: InterestLocation): InterestLocationEntity {
    return new InterestLocationEntity({
      bCode: location.bCode,
    });
  }
}
