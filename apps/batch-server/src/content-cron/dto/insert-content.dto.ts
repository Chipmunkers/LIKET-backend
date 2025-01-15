import { IsString, Length } from 'class-validator';

/**
 * @author jochongs
 */
export class InsertContentDto {
  /**
   * 컨텐츠 토큰
   */
  @IsString()
  @Length(1, 2000)
  token: string;
}
