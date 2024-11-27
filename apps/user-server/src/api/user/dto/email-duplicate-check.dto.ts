import { IsEmail, IsString } from 'class-validator';

/**
 * @author jochongs
 */
export class EmailDuplicateCheckDto {
  /**
   * 중복을 확인할 이메일
   */
  @IsString()
  @IsEmail()
  public email: string;
}
