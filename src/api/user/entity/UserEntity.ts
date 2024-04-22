import { User } from '@prisma/client';
import { UserProfileEntity } from './UserProfileEntity';

export class UserEntity<
  T extends 'my' | 'other' = 'my',
> extends UserProfileEntity {
  gender: T extends 'my' ? number | null : undefined;
  email: T extends 'my' ? string : undefined;
  birth: T extends 'my' ? number | null : undefined;
  createdAt: T extends 'my' ? Date : undefined;

  constructor(data: {
    idx: number;
    profileImgPath: string | null;
    nickname: string;
    provider: string;

    gender: T extends 'my' ? number | null : undefined;
    email: T extends 'my' ? string : undefined;
    birth: T extends 'my' ? number | null : undefined;
    createdAt: T extends 'my' ? Date : undefined;
  }) {
    super({
      idx: data.idx,
      profileImgPath: data.profileImgPath,
      nickname: data.nickname,
      provider: data.provider,
    });

    this.gender = data.gender;
    this.email = data.email;
    this.birth = data.birth;
    this.createdAt = data.createdAt;
  }

  static createMyInfoEntity(data: User): UserEntity<'my'> {
    return new UserEntity<'my'>({
      idx: data.idx,
      profileImgPath: data.profileImgPath || null,
      nickname: data.nickname,
      provider: data.provider,
      gender: data.gender,
      email: data.email,
      birth: data.birth,
      createdAt: data.createdAt,
    });
  }
}
