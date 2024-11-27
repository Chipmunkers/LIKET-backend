import { PickType } from '@nestjs/swagger';
import { SignUpDto } from './sign-up.dto';
import { IsOptional, IsString, Length } from 'class-validator';

/**
 * @author jochongs
 */
export class UpdateProfileDto extends PickType(SignUpDto, [
  'nickname',
  'gender',
  'birth',
]) {
  /**
   * 프로필 이미지
   *
   * @example "/profile-img/img_0000001.png"
   */
  @IsOptional()
  @IsString()
  @Length(1, 100)
  public profileImg?: string;
}
