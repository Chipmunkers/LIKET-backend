import {
  IsIn,
  IsInt,
  IsJWT,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { UploadFileDto } from '../../upload/dto/UploadFileDto';

export class SignUpDto {
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
  @IsStrongPassword({
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 1,
    minUppercase: 0,
  })
  @Length(6, 20)
  public pw: string;

  /**
   * 닉네임
   *
   * @example jochong
   */
  @Matches('^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$')
  public nickname: string;

  /**
   * 성별 1: 남자, 2: 여자
   *
   * @example
   */
  @IsOptional()
  @IsInt()
  @IsIn([1, 2])
  public gender?: 1 | 2;

  /**
   * 생년월일
   *
   * @example 2002
   */
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsOptional()
  public birth?: number;

  /**
   * 프로필 이미지
   *
   * @example "/profile-img/img_0000001.png"
   */
  @IsOptional()
  @ValidateNested()
  public profileImg?: UploadFileDto;
}
