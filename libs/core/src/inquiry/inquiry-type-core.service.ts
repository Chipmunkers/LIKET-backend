import { Injectable } from '@nestjs/common';
import { InquiryTypeCoreRepository } from 'libs/core/inquiry/inquiry-type-core.repository';
import { InquiryTypeModel } from 'libs/core/inquiry/model/inquiry-type.mode';

@Injectable()
export class InquiryTypeCoreService {
  constructor(
    private readonly inquiryTypeCoreRepository: InquiryTypeCoreRepository,
  ) {}

  /**
   * 문의 유형 전부 가져오기
   *
   * @author jochongs
   */
  public async findInquiryTypeAll(): Promise<InquiryTypeModel[]> {
    return (await this.inquiryTypeCoreRepository.selectInquiryTypeAll()).map(
      InquiryTypeModel.fromPrisma,
    );
  }

  /**
   * 문의 유형 하나 가져오기
   *
   * @author jochongs
   */
  public async findInquiryTypeByIdx(
    idx: number,
  ): Promise<InquiryTypeModel | null> {
    const inquiryType =
      await this.inquiryTypeCoreRepository.selectInquiryTypeByIdx(idx);

    return inquiryType && InquiryTypeModel.fromPrisma(inquiryType);
  }
}
