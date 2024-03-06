import { ValidateNested } from 'class-validator';
import { InquiryTypeEntity } from '../../entity/InquiryTypeEntity';

export class GetInquiryTypeAllResponseDto {
  @ValidateNested()
  typeList: InquiryTypeEntity[];
}
