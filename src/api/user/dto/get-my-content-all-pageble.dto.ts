import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';

export class GetMyCultureContentPagerble extends PickType(PagerbleDto, [
  'page',
]) {}
