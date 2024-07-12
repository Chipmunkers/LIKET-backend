import { SummaryInquiryEntity } from '../../entity/summary-inquiry.entity';

export class InquiryAllResponseDto {
  inquiryList: SummaryInquiryEntity[];
  count: number;
}
