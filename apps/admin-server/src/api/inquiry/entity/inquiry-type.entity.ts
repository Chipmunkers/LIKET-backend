import { InquiryType } from '@prisma/client';

export class InquiryTypeEntity {
  /**
   * 문의 유형 인덱스
   *
   * @example 12
   */
  public idx: number;

  /**
   * 문의 유형 이름
   *
   * @example "서비스 제안"
   */
  public name: string;

  constructor(data: InquiryTypeEntity) {
    Object.assign(this, data);
  }

  static createEntity(type: InquiryType) {
    return new InquiryTypeEntity({
      idx: type.idx,
      name: type.name,
    });
  }
}
