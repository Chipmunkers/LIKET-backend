import { User } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Matches, Max, Min } from 'class-validator';

export class UserEntity {
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
  @Matches(/^[a-zA-Z0-9가-힣_-]{2,8}$/g)
  public nickname: string;

  /**
   * 로그인 프로바이더
   *
   * @example local
   */
  public provider: string;

  /**
   * 성별
   *
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2])
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
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsOptional()
  public birth: number | null;

  /**
   * 회원 가입일
   *
   * @example 2025-05-07T12:00:00.000Z
   */
  public createdAt: Date;

  constructor(data: UserEntity) {
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
