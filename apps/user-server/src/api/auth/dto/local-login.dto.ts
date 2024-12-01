import { IsEmail, Length } from 'class-validator';

/**
 * @author jochongs
 */
export class LoginDto {
  /**
   * 이메일
   *
   * @example abc123@gmail.com
   */
  @IsEmail()
  email: string;

  /**
   * 비밀번호
   *
   * @example aA12341234**
   */
  @Length(1, 20)
  pw: string;
}
