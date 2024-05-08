import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMyReviewAllPagerbleDto extends PickType(PagerbleDto, [
  'page',
  'order',
]) {
  /**
   * 해당 리뷰로 라이켓이 만들어졌는지 여부 필터링
   *
   * @example true
   */
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  liket?: boolean;
}
