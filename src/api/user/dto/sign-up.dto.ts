import { IsJWT, IsStrongPassword, Length, Matches } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class SignUpDto extends PickType(UserEntity, [
  'nickname',
  'gender',
  'birth',
]) {
  /**
   * 이메일 인증 토큰
   *
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
   */
  @IsJWT()
  public emailToken: string;

  /**
   * 비밀번호
   *
   * @example aA12341234**
   */
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/)
  public pw: string;
}
