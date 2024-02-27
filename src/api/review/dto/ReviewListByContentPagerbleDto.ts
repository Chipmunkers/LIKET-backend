import { PickType } from '@nestjs/swagger';
import { PagenationDto } from '../../../common/dto/PagenationDto';
import { IsIn, IsString } from 'class-validator';

export class ReviewListByContentPagerbleDto extends PickType(PagenationDto, [
  'page',
]) {
  @IsString()
  @IsIn(['desc', 'asc'])
  order: 'desc' | 'asc' = 'desc';
}
