import { SummaryInquiryEntity } from '../../entity/summary-inquiry.entity';

export class GetInquiryAllResponseDto {
  inquiryList: SummaryInquiryEntity[];
  count: number;
}
