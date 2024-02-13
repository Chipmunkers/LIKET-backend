import { InquiryType } from '@prisma/client';

export class InquiryTypeEntity<
  T extends { idx: number; name: string } = { idx: number; name: string },
> {
  idx: number;
  name: string;
  constructor(data: T) {
    this.idx = data.idx;
    this.name = data.name;
  }

  static createInquiryType(inquiryType: InquiryType): InquiryTypeEntity {
    return new InquiryTypeEntity({
      idx: inquiryType.idx,
      name: inquiryType.name,
    });
  }
}
