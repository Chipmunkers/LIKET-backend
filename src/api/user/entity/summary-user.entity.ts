import { User } from '@prisma/client';
import { UserProfileEntity } from './user-profile.entity';

export class SummaryUserEntity extends UserProfileEntity {
  constructor(data: SummaryUserEntity) {
    super(data);
    Object.assign(this, data);
  }

  static createEntity(data: User) {
    return new SummaryUserEntity({
      idx: data.idx,
      profileImgPath: data.profileImgPath || null,
      nickname: data.nickname,
      provider: data.provider,
    });
  }
}
