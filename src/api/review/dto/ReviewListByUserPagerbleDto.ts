import { PickType } from '@nestjs/swagger';
import { PagenationDto } from '../../../common/dto/PagenationDto';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ReviewListByUserPagerbleDto extends PickType(PagenationDto, [
  'page',
]) {
  @IsString()
  @IsIn(['desc', 'asc'])
  @IsOptional()
  order: 'desc' | 'asc' = 'desc';

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  liket?: boolean;

  @Type(() => Number)
  @IsNumber()
  @IsIn([5, 10])
  @IsOptional()
  take: 5 | 10 = 10;
}
