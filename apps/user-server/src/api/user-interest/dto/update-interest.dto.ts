import { IsArray, IsInt, IsString } from 'class-validator';

/**
 * @author jochongs
 */
export class UpdateUserInterestDto {
  /**
   * 관심 장르 목록
   *
   * @example [1]
   */
  @IsArray()
  @IsInt({ each: true })
  genreList: number[];

  /**
   * 관심 스타일 목록
   *
   * @example [1]
   */
  @IsArray()
  @IsInt({ each: true })
  styleList: number[];

  /**
   * 관심 연령대 목록
   *
   * @example [1]
   */
  @IsArray()
  @IsInt({ each: true })
  ageList: number[];

  /**
   * 관심 지역 목록
   *
   * 서울일 경우 11
   *
   * @example 11
   */
  @IsArray()
  @IsString({ each: true })
  locationList: string[];
}
