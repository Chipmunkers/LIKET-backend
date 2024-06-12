import { IsEmail, IsEnum } from 'class-validator';
import { EmailCertType } from '../../model/email-cert-type';

export class SendEmailCertCodeDto {
  /**
   * 인증번호를 발송할 이메일
   *
   * @example abc123@gmail.com
   */
  @IsEmail()
  email: string;

  /**
   * 인증번호를 전송할 타입
   *
   * 0: 회원가입
   * 1: 비밀번호 찾기
   */
  @IsEnum(EmailCertType)
  type: EmailCertType;
}
