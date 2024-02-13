import { User } from '@prisma/client';

export class UserProfileEntity {
  idx: number;
  profileImgPath: string | null;
  nickname: string;
  provider: string;

  constructor(data: {
    idx: number;
    profileImgPath: string | null;
    nickname: string;
    provider: string;
  }) {
    this.idx = data.idx;
    this.profileImgPath = data.profileImgPath;
    this.nickname = data.nickname;
    this.provider = data.provider;
  }

  static createUserProfileEntity(user: User): UserProfileEntity {
    return new UserProfileEntity({
      idx: user.idx,
      profileImgPath: user.profileImgPath,
      nickname: user.nickname,
      provider: user.provider,
    });
  }
}
