import { PickType } from '@nestjs/swagger';
import { UserDto } from './UserDto';

export class MyInfoDto extends PickType(UserDto, [
  'idx',
  'email',
  'nickname',
  'gender',
  'birth',
  'provider',
  'profileImgPath',
]) {
  review: {
    count: number;
  };
  liket: {
    count: number;
  };
}
