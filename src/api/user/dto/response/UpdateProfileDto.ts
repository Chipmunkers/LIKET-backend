import { PickType } from '@nestjs/swagger';
import { SignUpDto } from '../request/SignUpDto';

export class UpdateProfileDto extends PickType(SignUpDto, [
  'nickname',
  'gender',
  'birth',
  'profileImg',
]) {}
