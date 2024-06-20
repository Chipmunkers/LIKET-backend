import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  Length,
} from 'class-validator';

export class CreateLiketDto {
  /**
   * 이미지 목록
   *
   * @example ['/liket/img_0000.1png']
   */
  @IsArray()
  @IsString({ each: true })
  @Length(1, 200, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  public img: string;

  /**
   * 라이켓 내용
   *
   * @example "낮엔 되게 비싸보이는데\n밤엔 엄청 비싸보이는 디올"
   */
  public description: string;
}
