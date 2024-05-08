import { User } from '@prisma/client';

export class UserProfileEntity {
  /**
   * 사용자 인덱스
   *
   * @example 12
   */
  public idx: number;

  /**
   * 프로필 이미지
   *
   * @example "/profile_img/img_000001.png"
   */
  public profileImgPath: string | null;

  /**
   * 닉네임
   *
   * @example jochong
   */
  public nickname: string;

  /**
   * 로그인 프로바이더
   *
   * @example local
   */
  public provider: string;

  constructor(data: UserProfileEntity) {
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
