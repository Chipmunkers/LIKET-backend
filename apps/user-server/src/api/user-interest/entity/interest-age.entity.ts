import { InterestAge } from '@prisma/client';

/**
 * @author jochongs
 */
export class InterestAgeEntity {
  /**
   * 연령대 인덱스
   */
  idx: number;

  constructor(data: InterestAgeEntity) {
    Object.assign(this, data);
  }

  static createEntity(interestAge: InterestAge): InterestAgeEntity {
    return new InterestAgeEntity({
      idx: interestAge.ageIdx,
    });
  }
}
