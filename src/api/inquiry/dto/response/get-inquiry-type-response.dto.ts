import { ValidateNested } from 'class-validator';
import { InquiryTypeEntity } from '../../entity/inquiry-type.entity';

export class GetInquiryTypeAllResponseDto {
  @ValidateNested()
  typeList: InquiryTypeEntity[];
}
