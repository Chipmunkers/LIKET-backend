import { IsEmail } from 'class-validator';

export class SendEmailVerificationCodeDto {
  @IsEmail()
  email: string;
}
