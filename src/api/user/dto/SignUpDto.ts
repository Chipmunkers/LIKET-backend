import {
  IsIn,
  IsInt,
  IsJWT,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { UploadFileDto } from '../../upload/dto/UploadFileDto';
import { Optional } from '@nestjs/common';

export class SignUpDto {
  @IsJWT()
  emailToken: string;

  @IsStrongPassword({
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 1,
  })
  @Length(6, 20)
  pw: string;

  @Matches('^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,8}$')
  nickname: string;

  @IsInt()
  @IsIn([1, 2])
  @Optional()
  gender?: 1 | 2;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @Optional()
  birth?: number;

  @Optional()
  @IsString()
  @ValidateNested()
  profileImg?: UploadFileDto;
}
