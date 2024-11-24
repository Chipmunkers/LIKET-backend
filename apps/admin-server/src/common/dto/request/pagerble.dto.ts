import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PagerbleDto {
  /**
   * 페이지네이션 번호, 1부터 시작
   *
   * @example 1
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  /**
   * 정렬 순서
   */
  @IsString()
  @IsIn(['desc', 'asc'])
  @IsOptional()
  order: 'desc' | 'asc' = 'desc';
}
