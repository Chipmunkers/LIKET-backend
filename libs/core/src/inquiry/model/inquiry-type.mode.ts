import { InquiryTypeSelectField } from 'libs/core/inquiry/model/prisma/inquiry-type-select-field';

/**
 * @author jochongs
 */
export class InquiryTypeModel {
  public readonly idx: number;
  public readonly name: string;

  constructor(data: InquiryTypeModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(type: InquiryTypeSelectField): InquiryTypeModel {
    return new InquiryTypeModel({
      idx: type.idx,
      name: type.name,
    });
  }
}
