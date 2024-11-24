import { IsString, Length } from 'class-validator';

export class BlockUserDto {
  /**
   * 정지 사유
   *
   * @example "악의적인 리뷰 작성"
   */
  @IsString()
  @Length(1, 50)
  reason: string;
}
