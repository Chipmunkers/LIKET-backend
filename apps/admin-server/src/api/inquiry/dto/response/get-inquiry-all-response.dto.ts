import { InquiryEntity } from '../../entity/inquiry.entity';
import { SummaryInquiryEntity } from '../../entity/summary-inquiry.entity';

export class GetInquiryAllResponseDto {
  inquiryList: SummaryInquiryEntity[];

  /**
   * 검색된 문의 개수
   *
   * @example 12
   */
  count: number;
}
