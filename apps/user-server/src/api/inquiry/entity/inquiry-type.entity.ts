import { InquiryType } from '@prisma/client';
import { InquiryTypeModel } from 'libs/core/inquiry/model/inquiry-type.mode';

/**
 * @author jochongs
 */
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

  /**
   * `InquiryCoreModule`이 개발됨에 따라 deprecated되었습니다.
   * 대신, `fromModel` 정적 메서드를 사용하십시오.
   *
   * @deprecated
   */
  static createEntity(inquiryType: InquiryType): InquiryTypeEntity {
    return new InquiryTypeEntity({
      idx: inquiryType.idx,
      name: inquiryType.name,
    });
  }

  public static fromModel(typeModel: InquiryTypeModel): InquiryTypeEntity {
    return new InquiryTypeEntity({
      idx: typeModel.idx,
      name: typeModel.name,
    });
  }
}
