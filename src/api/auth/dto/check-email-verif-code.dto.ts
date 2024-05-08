import { IsEmail, IsString, Length } from 'class-validator';

export class CheckEmailVerificationCodeDto {
  /**
   * 인증을 확인할 이메일
   *
   * @example abc123@gmail.com
   */
  @IsEmail()
  email: string;

  /**
   * 인증 코드
   *
   * @example 182933
   */
  @IsString()
  @Length(6, 6)
  code: string;
}
