import { PickType } from '@nestjs/swagger';
import { PagenationDto } from '../../../common/dto/PagenationDto';

export class ContentListByUserIdxPagerbleDto extends PickType(PagenationDto, [
  'page',
]) {}
