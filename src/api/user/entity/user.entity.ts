import { User } from '@prisma/client';
import { SummaryUserEntity } from './summary-user.entity';

export class UserEntity extends SummaryUserEntity {
  /**
   * 성별
   *
   * @example 1
   */
  public gender: number | null;

  /**
   * 이메일
   *
   * @example abc123@gmail.com
   */
  public email: string;

  /**
   * 생년월일
   *
   * @example 2002
   */
  public birth: number | null;

  /**
   * 회원 가입일
   *
   * @example 2025-05-07T12:00:00.000Z
   */
  public createdAt: Date;

  constructor(data: UserEntity) {
    super(data);
    Object.assign(this, data);
  }

  static createEntity(user: User) {
    return new UserEntity({
      idx: user.idx,
      profileImgPath: user.profileImgPath || null,
      nickname: user.nickname,
      provider: user.provider,
      gender: user.gender,
      email: user.email,
      birth: user.birth,
      createdAt: user.createdAt,
    });
  }
}
