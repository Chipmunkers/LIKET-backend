import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { UserSelectField } from 'libs/core/user/model/prisma/user-select-field';

/**
 * @author jochongs
 */
export class UserModel {
  /**
   * 사용자 식별자
   *
   * @example 12
   */
  public readonly idx: number;

  /**
   * 관리자 여부
   *
   * @example false
   */
  public readonly isAdmin: boolean;

  /**
   * 프로필 이미지 경로
   *
   * @example "/profile_img/img_000001.png"
   */
  public readonly profileImgPath: string | null;

  /**
   * 비밀번호 (암호화된 비밀번호)
   */
  public readonly pw: string | null;

  /**
   * 닉네임
   *
   * @example 홍길동
   */
  public readonly nickname: string;

  /**
   * 이메일
   *
   * @example liket1234@gmail.com
   */
  public readonly email: string;

  /**
   * 신고 당한 횟수
   *
   * @example 12
   */
  public readonly reportCount: number;

  /**
   * 성별
   *
   * @example 1
   */
  public readonly gender: number | null;

  /**
   * 생년월일
   *
   * @example 2002
   */
  public readonly birth: number | null;

  /**
   * 프로바이더
   * (kakao, local, apple)
   *
   * @example "kakao"
   */
  public readonly provider: string;

  /**
   * 인증 제공사 식별값
   *
   * @example "123123"
   */
  public readonly snsId: string | null;

  /**
   * 로그인 시간
   *
   * @example 2025-05-07T12:00:00.000Z
   */
  public readonly loginAt: Date | null;

  /**
   * 정지 시간, 비어있을 경우 계정 정지된 것이 아님
   *
   * @example 2025-05-07T12:00:00.000Z
   */
  public readonly blockedAt: Date | null;

  /**
   * 회원 가입일
   *
   * @example 2025-05-07T12:00:00.000Z
   */
  public readonly createdAt: Date;

  constructor(data: UserModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(user: UserSelectField): UserModel {
    return new UserModel({
      idx: user.idx,
      isAdmin: user.isAdmin,
      profileImgPath: user.profileImgPath,
      nickname: user.nickname,
      gender: user.gender,
      provider: user.provider,
      pw: user.pw,
      email: user.email,
      reportCount: user.reportCount,
      birth: user.birth,
      snsId: user.snsId,
      loginAt: user.loginAt,
      blockedAt: user.blockedAt,
      createdAt: user.createdAt,
    });
  }
}
