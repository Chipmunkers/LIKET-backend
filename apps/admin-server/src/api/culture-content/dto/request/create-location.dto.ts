import { IsDecimal, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLocationDto {
  /**
   * 1깊이 지역 이름
   *
   * @example 전북
   */
  @IsString()
  @Length(1, 20)
  region1Depth: string;

  /**
   * 2깊이 지역 이름
   *
   * @example 익산시
   */
  @IsString()
  @Length(1, 20)
  region2Depth: string;

  /**
   * 주소
   *
   * @example "전북 익산시 부송동 100"
   */
  @IsString()
  @Length(1, 200)
  address: string;

  /**
   * 자세한 주소
   *
   * @example "LH아파트 1205호"
   */
  @IsString()
  @Length(1, 200)
  detailAddress: string;

  /**
   * 행정동 코드
   *
   * @example "4514069000"
   */
  @IsString()
  @Length(1, 10)
  hCode: string;

  /**
   * 법정동 코드
   *
   * @example "4514013400"
   */
  @IsString()
  @Length(1, 10)
  bCode: string;

  /**
   * X좌표
   *
   * @example "126.99597295767953"
   */
  @Type(() => Number)
  @IsDecimal()
  positionX: number;

  /**
   * Y좌표
   *
   * @example "35.97664845766847"
   */
  @Type(() => Number)
  @IsDecimal()
  positionY: number;
}
