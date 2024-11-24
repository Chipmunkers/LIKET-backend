import { IsString, Length } from 'class-validator';

export class LoginDto {
  /**
   * 관리자 사용자 이메일
   *
   * @example abc123@gmail.com
   */
  @IsString()
  public email: string;

  /**
   * 관리자 사용자 비밀번호
   *
   * @example aA12341234**
   */
  @Length(1, 20)
  public pw: string;
}
