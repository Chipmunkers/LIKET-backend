import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';

export class InquiryPagerbleDto extends PickType(PagerbleDto, [
  'page',
  'order',
]) {}
