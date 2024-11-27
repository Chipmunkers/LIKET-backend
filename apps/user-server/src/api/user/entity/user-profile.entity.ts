import { PickType } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserEntity } from './user.entity';

/**
 * @author jochongs
 */
export class UserProfileEntity extends PickType(UserEntity, [
  'idx',
  'profileImgPath',
  'nickname',
  'provider',
]) {
  constructor(data: UserProfileEntity) {
    super();
    Object.assign(this, data);
  }

  static createEntity(user: User) {
    return new UserProfileEntity({
      idx: user.idx,
      profileImgPath: user.profileImgPath,
      nickname: user.nickname,
      provider: user.provider,
    });
  }
}
