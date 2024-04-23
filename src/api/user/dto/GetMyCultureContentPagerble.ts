import { PickType } from '@nestjs/swagger';
import { PagenationDto } from '../../../common/dto/PagenationDto';

export class GetMyCultureContentPagerble extends PickType(PagenationDto, [
  'page',
]) {}
