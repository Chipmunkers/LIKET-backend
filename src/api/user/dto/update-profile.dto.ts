import { PickType } from '@nestjs/swagger';
import { SignUpDto } from './sign-up.dto';

export class UpdateProfileDto extends PickType(SignUpDto, [
  'nickname',
  'gender',
  'birth',
  'profileImg',
]) {}
