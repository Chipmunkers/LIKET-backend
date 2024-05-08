import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';
import { IsIn, IsString } from 'class-validator';

export class GetReviewByContentPagerbleDto extends PickType(PagerbleDto, [
  'page',
  'order',
]) {
  /**
   * 정렬 요소
   *
   * @example time
   */
  @IsString()
  @IsIn(['time', 'like'])
  orderby: 'time' | 'like' = 'time';
}
