import { InquiryEntity } from '../../entity/InquiryEntity';

export class GetInquiryAllResponseDto {
  inquiryList: InquiryEntity<'summary'>[];
  count: number;
}
