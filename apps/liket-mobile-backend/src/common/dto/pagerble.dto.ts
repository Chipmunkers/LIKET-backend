import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PagerbleDto {
  /**
   * 페이지네이션 번호, 1부터 시작
   *
   * @example 2
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  /**
   * 정렬 순서
   *
   * @example desc
   */
  @IsString()
  @IsIn(['desc', 'asc'])
  order: 'desc' | 'asc' = 'desc';
}
