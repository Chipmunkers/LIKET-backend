import { Injectable } from '@nestjs/common';
import { InquiryTypeEntity } from './entity/inquiry-type.entity';
import { InquiryTypeNotFoundException } from './exception/InquiryTypeNotFoundException';
import { InquiryTypeRepository } from './inquiry-type.repository';

@Injectable()
export class InquiryTypeService {
  constructor(private readonly inquiryTypeRepository: InquiryTypeRepository) {}

  /**
   * 문의 유형 모두 가져오기
   *
   * @author jochongs
   */
  public async getTypeAll(): Promise<InquiryTypeEntity[]> {
    const typeList = await this.inquiryTypeRepository.selectInquiryTypeAll();

    return typeList.map((type) => InquiryTypeEntity.createEntity(type));
  }

  /**
   * 문의 유형 자세히보기
   *
   * @author jochongs
   */
  public async getTypeByIdx(idx: number): Promise<InquiryTypeEntity> {
    const type = await this.inquiryTypeRepository.selectInquiryByIdx(idx);

    if (!type) {
      throw new InquiryTypeNotFoundException('Cannot find inquiry type');
    }

    return InquiryTypeEntity.createEntity(type);
  }
}
