import {
  ArrayMaxSize,
  IsDecimal,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class StopoverDto {
  x: number;

  y: number;
}

/**
 * @author jochongs
 */
export class GetPedestrianDto {
  /**
   * 출발지 명칭
   *
   * @example "광치기 해변"
   */
  @IsString()
  @Length(1, 200)
  startName: string;

  /**
   * 출발지 X좌표(경도)의 좌푯값
   *
   * @example 126.9246033
   */
  @IsNumber()
  startX: number;

  /**
   * 출발지 Y 좌표(위도)의 좌푯값
   *
   * @example 33.45241976
   */
  @IsNumber()
  startY: number;

  /**
   * 목적지 명칭
   *
   * @example endName
   */
  @IsString()
  @Length(1, 200)
  endName: string;

  /**
   * 목적지 X좌표(경도)의 좌푯값
   *
   * @example 126.9041895
   */
  @IsNumber()
  endX: number;

  /**
   * 출발지 Y 좌표(위도)의 좌푯값
   *
   * @example 33.4048969
   */
  @IsNumber()
  endY: number;

  /**
   * 경유지 목록
   */
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMaxSize(5)
  stopoverList: StopoverDto[] = [];
}
