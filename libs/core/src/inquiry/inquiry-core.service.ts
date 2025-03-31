import { Injectable } from '@nestjs/common';
import { FindInquiryAllInput } from 'libs/core/inquiry/input/find-inquiry-all.input';
import { InquiryCoreRepository } from 'libs/core/inquiry/inquiry-core.repository';
import { InquiryModel } from 'libs/core/inquiry/model/inquiry.model';
import { SummaryInquiryModel } from 'libs/core/inquiry/model/summary-inquiry.model';

@Injectable()
export class InquiryCoreService {
  constructor(private readonly inquiryCoreRepository: InquiryCoreRepository) {}

  /**
   * 문의 목록 불러오기
   *
   * @author jochongs
   */
  public async findInquiryAll(
    input: FindInquiryAllInput,
  ): Promise<SummaryInquiryModel[]> {
    return (await this.inquiryCoreRepository.selectInquiryAll(input)).map(
      SummaryInquiryModel.fromPrisma,
    );
  }
}
