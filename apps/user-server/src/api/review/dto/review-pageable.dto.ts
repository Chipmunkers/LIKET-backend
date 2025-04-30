import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ToBoolean } from 'apps/user-server/src/common/decorator/to-boolean.decorator';

/**
 * @author jochongs
 */
export class ReviewPageableDto extends PickType(PagerbleDto, [
  'page',
  'order',
]) {
  /**
   * 특정 사용자의 리뷰 필터링
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  user?: number;

  /**
   * 특정 컨텐츠의 리뷰 필터링
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  content?: number;

  /**
   * 정렬 요소
   *
   * @example time
   */
  @IsString()
  @IsIn(['time', 'like'])
  orderby: 'time' | 'like' = 'time';

  /**
   * 미리 볼 review idx
   * 해당 필터링이 들어갈 경우 최상단에 해당 idx를 가진 리뷰가 올라옴.
   * 만약, page가 1이 아닌 경우에는 해당 리뷰가 최상단에 올라가지 않음.
   * 또한, content 필터와 무관하게 돌아가기 때문에 review가 content에 속하지 않더라도 가져와짐.
   *
   * @example 12
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  review?: number;

  /**
   * 라이켓 작성 여부
   *
   * @example true
   */
  @ToBoolean()
  @IsOptional()
  liket?: boolean;
}
