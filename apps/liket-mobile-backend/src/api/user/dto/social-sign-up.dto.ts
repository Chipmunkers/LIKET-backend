import { PickType } from '@nestjs/swagger';
import { SignUpDto } from '../../user/dto/sign-up.dto';
import { IsJWT, IsString } from 'class-validator';

export class SocialSignUpDto extends PickType(SignUpDto, [
  'birth',
  'gender',
  'nickname',
]) {
  /**
   * 로그인 시 발급된 토큰
   *
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
   */
  @IsString()
  @IsJWT()
  public token: string;
}
