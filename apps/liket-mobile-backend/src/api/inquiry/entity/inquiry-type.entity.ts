import { InquiryType } from '@prisma/client';

export class InquiryTypeEntity {
  /**
   * 문의 유형 인덱스
   *
   * @example 1
   */
  public idx: number;

  /**
   * 문의 유형 이름
   *
   * @example "서비스 이용 문의"
   */
  public name: string;

  constructor(data: InquiryTypeEntity) {
    Object.assign(this, data);
  }

  static createEntity(inquiryType: InquiryType): InquiryTypeEntity {
    return new InquiryTypeEntity({
      idx: inquiryType.idx,
      name: inquiryType.name,
    });
  }
}
