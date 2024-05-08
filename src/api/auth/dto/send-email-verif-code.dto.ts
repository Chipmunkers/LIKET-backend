import { IsEmail } from 'class-validator';

export class SendEmailVerificationCodeDto {
  /**
   * 이메일
   *
   * @example abc123@gmail.com
   */
  @IsEmail()
  email: string;
}
