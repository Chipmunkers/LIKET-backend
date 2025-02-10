import { PickType } from '@nestjs/swagger';
import { UserModel } from 'libs/core/user/model/user.model';

/**
 * @author jochongs
 */
export class CreateUserInput extends PickType(UserModel, [
  'isAdmin',
  'profileImgPath',
  'pw',
  'nickname',
  'email',
  'gender',
  'birth',
  'provider',
  'snsId',
]) {}
