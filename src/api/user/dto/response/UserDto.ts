import { User } from '@prisma/client';

export class UserDto {
  idx: number;
  isAdmin: boolean;
  email: string;
  nickname: string;
  gender: number | null;
  birth: number | null;
  provider: string;
  profileImgPath: string | null;
  blockedAt: Date | null;
  createdAt: Date;

  constructor(
    idx: number,
    isAdmin: boolean,
    email: string,
    nickname: string,
    gender: number | null,
    birth: number | null,
    provider: string,
    profileImgPath: string | null,
    blockedAt: Date | null,
    createdAt: Date,
  ) {
    this.idx = idx;
    this.isAdmin = isAdmin;
    this.email = email;
    this.nickname = nickname;
    this.gender = gender;
    this.birth = birth;
    this.provider = provider;
    this.profileImgPath = profileImgPath;
    this.blockedAt = blockedAt;
    this.createdAt = createdAt;
  }

  static ofPrismaModel(user: User): UserDto {
    return new UserDto(
      user.idx,
      user.isAdmin,
      user.email,
      user.nickname,
      user.gender,
      user.birth,
      user.provider,
      user.profileImgPath,
      user.blockedAt,
      user.createdAt,
    );
  }
}
