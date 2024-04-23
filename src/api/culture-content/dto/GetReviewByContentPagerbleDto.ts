import { PickType } from '@nestjs/swagger';
import { PagenationDto } from '../../../common/dto/PagenationDto';
import { IsIn, IsString } from 'class-validator';

export class GetReviewByContentPagerbleDto extends PickType(PagenationDto, [
  'page',
]) {
  @IsString()
  @IsIn(['desc', 'asc'])
  order: 'desc' | 'asc' = 'desc';

  @IsString()
  @IsIn(['time', 'like'])
  orderby: 'time' | 'like' = 'time';
}
