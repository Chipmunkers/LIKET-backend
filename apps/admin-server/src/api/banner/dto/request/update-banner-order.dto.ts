import { IsInt, Min } from 'class-validator';

export class UpdateBannerOrderDto {
  /**
   * 변경하려는 배너의 순서
   *
   * @example 3
   */
  @IsInt()
  @Min(1)
  order: number;
}
