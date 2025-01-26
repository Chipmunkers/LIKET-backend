import { InterestStyle } from '@prisma/client';

/**
 * @author jochongs
 */
export class InterestStyleEntity {
  /**
   * 스타일 인덱스
   */
  idx: number;

  constructor(data: InterestStyleEntity) {
    Object.assign(this, data);
  }

  static createEntity(interestStyle: InterestStyle): InterestStyleEntity {
    return new InterestStyleEntity({
      idx: interestStyle.styleIdx,
    });
  }
}
