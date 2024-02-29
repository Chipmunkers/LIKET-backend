import { PickType } from '@nestjs/swagger';
import { PagenationDto } from '../../../common/dto/PagenationDto';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export class ReviewListPagerbleDto extends PickType(PagenationDto, ['page']) {
  @IsString()
  @IsIn(['idx', 'nickname', 'contents'])
  searchby?: 'idx' | 'nickname' | 'contents';

  @IsString()
  @Length(1, 20)
  @IsOptional()
  search?: string;

  @IsString()
  @IsIn(['desc', 'asc'])
  order: 'desc' | 'asc' = 'desc';
}
