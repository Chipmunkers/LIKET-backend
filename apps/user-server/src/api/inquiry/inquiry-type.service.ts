import { Injectable } from '@nestjs/common';
import { InquiryTypeEntity } from './entity/inquiry-type.entity';
import { InquiryTypeNotFoundException } from './exception/InquiryTypeNotFoundException';
import { InquiryTypeCoreService } from 'libs/core/inquiry/inquiry-type-core.service';

@Injectable()
export class InquiryTypeService {
  constructor(
    private readonly inquiryTypeCoreService: InquiryTypeCoreService,
  ) {}

  /**
   * 문의 유형 모두 가져오기
   *
   * @author jochongs
   */
  public async getTypeAll(): Promise<InquiryTypeEntity[]> {
    const typeList = await this.inquiryTypeCoreService.findInquiryTypeAll();

    return typeList.map((type) => InquiryTypeEntity.fromModel(type));
  }

  /**
   * 문의 유형 자세히보기
   *
   * @author jochongs
   */
  public async getTypeByIdx(idx: number): Promise<InquiryTypeEntity> {
    const type = await this.inquiryTypeCoreService.findInquiryTypeByIdx(idx);

    if (!type) {
      throw new InquiryTypeNotFoundException('Cannot find inquiry type');
    }

    return InquiryTypeEntity.fromModel(type);
  }
}
