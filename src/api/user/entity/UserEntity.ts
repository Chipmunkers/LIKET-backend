import { User } from '@prisma/client';
import { UserProfileEntity } from './UserProfileEntity';

export class UserEntity<
  T extends 'my' | 'other' = 'my',
  K extends 'user' | 'admin' = 'user',
> extends UserProfileEntity {
  gender: T extends 'my' ? number | null : undefined;
  email: T extends 'my' ? string : undefined;
  birth: T extends 'my' ? number | null : undefined;
  createdAt: T extends 'my' ? Date : undefined;

  isAdmin: K extends 'admin' ? boolean : undefined;
  blockedAt: K extends 'admin' ? Date | null : undefined;

  constructor(data: {
    idx: number;
    profileImgPath: string | null;
    nickname: string;
    provider: string;

    gender: T extends 'my' ? number | null : undefined;
    email: T extends 'my' ? string : undefined;
    birth: T extends 'my' ? number | null : undefined;
    createdAt: T extends 'my' ? Date : undefined;

    isAdmin: K extends 'admin' ? boolean : undefined;
    blockedAt: K extends 'admin' ? Date | null : undefined;
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

    this.isAdmin = data.isAdmin;
    this.blockedAt = data.blockedAt;
  }

  static createMyInfoEntity(data: User): UserEntity<'my', 'user'> {
    return new UserEntity<'my', 'user'>({
      idx: data.idx,
      profileImgPath: data.profileImgPath || null,
      nickname: data.nickname,
      provider: data.provider,
      gender: data.gender,
      email: data.email,
      birth: data.birth,
      createdAt: data.createdAt,
      isAdmin: undefined,
      blockedAt: undefined,
    });
  }

  static createUserEntityForAdmin(data: User): UserEntity<'my', 'admin'> {
    return new UserEntity<'my', 'admin'>({
      idx: data.idx,
      profileImgPath: data.profileImgPath || null,
      nickname: data.nickname,
      provider: data.provider,
      gender: data.gender,
      email: data.email,
      birth: data.birth,
      createdAt: data.createdAt,
      isAdmin: data.isAdmin,
      blockedAt: data.blockedAt,
    });
  }
}
