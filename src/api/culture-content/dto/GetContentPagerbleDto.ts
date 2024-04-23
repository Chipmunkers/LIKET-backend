import { PickType } from '@nestjs/swagger';
import { PagenationDto } from '../../../common/dto/PagenationDto';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetContentPagerbleDto extends PickType(PagenationDto, ['page']) {
  /**
   * Genre idx
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  genre?: number;

  /**
   * Age idx
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  age?: number;

  /**
   * H code
   */
  @IsString()
  @IsOptional()
  region?: string;

  /**
   * Style idx
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  style?: number;

  /**
   * open state
   */
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  open?: boolean;

  /**
   * order
   */
  @IsString()
  @IsIn(['desc', 'asc'])
  order: 'desc' | 'asc' = 'desc';

  @IsString()
  @IsIn(['time', 'like'])
  @IsOptional()
  orderby: 'time' | 'like' = 'time';

  /**
   * Search keyword
   */
  @IsString()
  @IsOptional()
  @Length(1, 10)
  search?: string;
}
