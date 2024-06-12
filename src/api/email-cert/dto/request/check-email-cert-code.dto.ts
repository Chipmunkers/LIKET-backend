import { IsEmail, IsEnum, IsString } from 'class-validator';
import { EmailCertType } from '../../model/email-cert-type';

export class CheckEmailCertCodeDto {
  /**
   * 인증번호를 확인할 이메일
   *
   * @example abc123@gmail.com
   */
  @IsEmail()
  public email: string;

  /**
   * 인증번호
   *
   * @example 123123
   */
  @IsString()
  public code: string;

  /**
   * 인증번호를 전송할 타입
   *
   * 0: 회원가입
   * 1: 비밀번호 찾기
   */
  @IsEnum(EmailCertType)
  type: EmailCertType;
}
