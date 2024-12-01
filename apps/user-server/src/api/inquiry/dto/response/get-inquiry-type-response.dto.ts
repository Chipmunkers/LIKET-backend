import { ValidateNested } from 'class-validator';
import { InquiryTypeEntity } from '../../entity/inquiry-type.entity';

/**
 * @author jochongs
 */
export class GetInquiryTypeAllResponseDto {
  @ValidateNested()
  typeList: InquiryTypeEntity[];
}
