import { PickType } from '@nestjs/swagger';
import { PagenationDto } from '../../../common/dto/PagenationDto';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class BannerListPagerbleDto extends PickType(PagenationDto, ['page']) {
  @IsString()
  @IsIn(['desc', 'asc'])
  @IsOptional()
  order: 'desc' | 'asc' = 'desc';
}
