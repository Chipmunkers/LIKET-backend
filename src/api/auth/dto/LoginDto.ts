import { IsEmail, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @Length(1, 20)
  pw: string;
}
