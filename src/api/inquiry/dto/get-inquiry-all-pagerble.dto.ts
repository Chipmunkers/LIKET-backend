import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';

export class GetInquiryAllPagerbleDto extends PickType(PagerbleDto, [
  'page',
  'order',
]) {}
