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
  @IsJWT()
  emailToken: string;

  @IsStrongPassword({
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 1,
    minUppercase: 0,
  })
  @Length(6, 20)
  pw: string;

  @Matches('^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$')
  nickname: string;

  @IsOptional()
  @IsInt()
  @IsIn([1, 2])
  gender?: 1 | 2;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsOptional()
  birth?: number;

  @IsOptional()
  @ValidateNested()
  profileImg?: UploadFileDto;
}
