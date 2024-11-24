import { Prisma, User } from '@prisma/client';

const userWithInclude = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    BlockReason: true,
  },
});
type UserWithInclude = Prisma.UserGetPayload<typeof userWithInclude>;

export class UserEntity {
  /**
   * 사용자 인덱스
   *
   * @example 2
   */
  public idx: number;

  /**
   * 프로필이미지 경로
   *
   * @example https://s3.ap-northeast-2.liket/user_profile/profile_img_123123.png
   */
  public profileImgPath: string;

  /**
   * 사용자 닉네임
   *
   * @example jjjuuu_a
   */
  public nickname: string;

  /**
   * 로그인 공급자 (local, kakao, apple)
   *
   * @example local
   */
  public provider: string;

  /**
   * 사용자 이메일
   *
   * @example abc123@gmail.com
   */
  public email: string;

  /**
   * 사용자 성별
   * 1: 남성
   * 2: 여성
   *
   * @example 1
   */
  public gender: number | null;

  /**
   * 사용자 생년월일
   *
   * @example 1998
   */
  public birth: number | null;

  /**
   * 정지된 날짜
   *
   * @example 2024-05-01T10:11:00.000Z
   */
  public blockedAt: Date | null;

  /**
   * 정지 이유
   *
   * @example "악의적인 문의"
   */
  public blockReason: string | null;

  /**
   * 사용자 가입일
   *
   * @example 2024-05-01T10:11:00.000Z
   */
  public createdAt: Date;

  /**
   * 사용자 탈퇴일
   *
   * @example 2024-05-01T10:11:00.000Z
   */
  public deletedAt: Date | null;

  constructor(data: UserEntity) {
    Object.assign(this, data);
  }

  static createEntity(user: UserWithInclude) {
    return new UserEntity({
      idx: user.idx,
      profileImgPath: user.profileImgPath || null,
      nickname: user.nickname,
      provider: user.provider,
      gender: user.gender,
      email: user.email,
      birth: user.birth,
      blockReason: user.BlockReason[0] && user.blockedAt ? user.BlockReason[0].reason : null,
      blockedAt: user.blockedAt,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
    });
  }
}
