import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class MapPagerbleDto {
  /**
   * 좌측 상단 x 좌표
   *
   * @example "126.83606673798123"
   */
  @Type(() => Number)
  @IsNumber()
  'top-x': number;

  /**
   * 좌측 상단 y 좌표
   *
   * @example "37.000000000000256"
   */
  @Type(() => Number)
  @IsNumber()
  'top-y': number;

  /**
   * 우측 하단 x 좌표
   *
   * @example "127.14772903225513"
   */
  @Type(() => Number)
  @IsNumber()
  'bottom-x': number;

  /**
   * 우측 하단 y 좌표
   *
   * @example "37.88103225806477"
   */
  @Type(() => Number)
  @IsNumber()
  'bottom-y': number;

  /**
   * 클러스터링 레벨: 아래 단계에 맞춰 개수를 수집하여 보여줌
   * 1: 시군구
   * 2: 읍면동
   * 3: 리
   *
   * @example 7
   */
  @Type(() => Number)
  @IsIn([1, 2, 3])
  level: 1 | 2 | 3;

  /**
   * 필터링할 스타일 배열
   *
   * @example [1, 2, 3]
   */
  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  @ArrayMaxSize(3)
  styles: number[] = [];

  /**
   * 장르 필터링
   *
   * @example 2
   */
  @Type(() => Number)
  @IsOptional()
  genre?: number;

  /**
   * 연령대 필터링
   *
   * @example 3
   */
  @Type(() => Number)
  @IsOptional()
  age?: number;
}
