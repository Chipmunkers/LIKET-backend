import { IsJWT } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { SignUpDto } from './sign-up.dto';

/**
 * @author jochongs
 */
export class FindPwDto extends PickType(SignUpDto, ['pw'] as const) {
  /**
   * 이메일 인증 토큰
   *
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJlbWFpbCI6IiIsInR5cGUiOjF9.5tR-GABK51ELI5KCxxBru7KtDhxo1AOJ1aymi89paME"
   */
  @IsJWT()
  public emailToken: string;
}
