import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from 'libs/core/user/input/create-user.input';
import { UpdateUserInput } from 'libs/core/user/input/update-user.input';
import { UserSelectField } from 'libs/core/user/model/prisma/user-select-field';
import { UserProvider } from 'libs/core/user/constant/user-provider.constant';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class UserCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<
      TransactionalAdapterPrisma<PrismaProvider>
    >,
  ) {}

  /**
   * SELECT user WHERE sns_id = $1
   *
   * @author jochongs
   *
   * @param id sns_id
   * @param provider 인증 권한 제공사
   */
  public async selectUserById(
    id: string,
    provider: UserProvider,
  ): Promise<UserSelectField | null> {
    return await this.txHost.tx.user.findFirst({
      select: {
        idx: true,
        email: true,
        isAdmin: true,
        profileImgPath: true,
        pw: true,
        nickname: true,
        provider: true,
        reportCount: true,
        gender: true,
        birth: true,
        snsId: true,
        loginAt: true,
        createdAt: true,
        blockedAt: true,
      },
      where: {
        snsId: id,
        provider,
        deletedAt: null,
      },
    });
  }

  /**
   * SELECT user WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx user 식별자
   */
  public async selectUserByIdx(idx: number): Promise<UserSelectField | null> {
    return await this.txHost.tx.user.findUnique({
      select: {
        idx: true,
        email: true,
        isAdmin: true,
        profileImgPath: true,
        pw: true,
        nickname: true,
        provider: true,
        reportCount: true,
        gender: true,
        birth: true,
        snsId: true,
        loginAt: true,
        createdAt: true,
        blockedAt: true,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  /**
   * SELECT user WHERE email = $1
   *
   * @author jochongs
   *
   * @param email 사용자 이메일
   */
  public async selectUserByEmail(
    email: string,
  ): Promise<UserSelectField | null> {
    return await this.txHost.tx.user.findFirst({
      select: {
        idx: true,
        email: true,
        isAdmin: true,
        profileImgPath: true,
        pw: true,
        nickname: true,
        provider: true,
        reportCount: true,
        gender: true,
        birth: true,
        snsId: true,
        loginAt: true,
        createdAt: true,
        blockedAt: true,
      },
      where: {
        deletedAt: null,
        email,
      },
    });
  }

  /**
   * INSERT user
   *
   * @author jochongs
   */
  public async insertUser(
    createUserInput: Omit<CreateUserInput, 'pw'> & {
      encryptedPw: string | null;
    },
  ): Promise<UserSelectField> {
    return await this.txHost.tx.user.create({
      select: {
        idx: true,
        email: true,
        isAdmin: true,
        profileImgPath: true,
        pw: true,
        nickname: true,
        provider: true,
        reportCount: true,
        gender: true,
        birth: true,
        snsId: true,
        loginAt: true,
        createdAt: true,
        blockedAt: true,
      },
      data: {
        email: createUserInput.email,
        birth: createUserInput.birth,
        pw: createUserInput.encryptedPw,
        nickname: createUserInput.nickname,
        gender: createUserInput.gender,
        profileImgPath: createUserInput.profileImgPath,
        provider: createUserInput.provider,
        snsId: createUserInput.snsId,
      },
    });
  }

  /**
   * UPDATE user SET ... WHERE idx = $1
   *
   * @author jochongs
   */
  public async updateUserByIdx(
    idx: number,
    updateInput: Omit<UpdateUserInput, 'pw'> & { encryptedPw?: string },
  ): Promise<UserSelectField> {
    return await this.txHost.tx.user.update({
      where: {
        idx,
      },
      data: {
        pw: updateInput.encryptedPw,
        nickname: updateInput.nickname,
        email: updateInput.email,
        gender: updateInput.gender,
        birth: updateInput.birth,
        profileImgPath: updateInput.profileImgPath,
        isAdmin: updateInput.isAdmin,
        blockedAt: updateInput.blockedAt,
      },
    });
  }

  /**
   * SOFT DELETE user WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 삭제할 컨텐츠 식별자
   */
  public async softDeleteUserByIdx(idx: number): Promise<void> {
    await this.txHost.tx.user.update({
      where: { idx, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * UPDATE report_count WHERE idx = $1
   *
   * @author jochongs
   *
   * @param idx 사용자 식별자
   * @param count 증가 시킬 신고 횟수
   */
  public async increaseReportCountByIdx(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.user.update({
      where: { idx, deletedAt: null },
      data: {
        reportCount: {
          increment: count,
        },
      },
    });
  }

  /**
   * UPDATE report_count WHERE idx = $1
   * 신고 횟수 감소
   *
   * @author jochongs
   *
   * @param idx 사용자 식별자
   * @param count 감소 시킬 신고 횟수
   */
  public async decreaseReportCountByIdx(
    idx: number,
    count: number,
  ): Promise<void> {
    await this.txHost.tx.user.update({
      where: { idx, deletedAt: null },
      data: {
        reportCount: {
          decrement: count,
        },
      },
    });
  }

  /**
   * SELECT COUNT(*) FROM review WHERE user_idx = $1
   *
   * @author jochongs
   *
   * @param idx 사용자 식별자
   */
  public async selectReviewCountByUserIdx(idx: number): Promise<number> {
    return await this.txHost.tx.review.count({
      where: {
        deletedAt: null,
        userIdx: idx,
      },
    });
  }

  /**
   * SELECT COUNT(*) FROM content_like_tb WHERE user_idx = $1
   *
   * @author jochongs
   *
   * @param idx 사용자 식별자
   */
  public async selectCultureContentLikeCountByUserIdx(
    idx: number,
  ): Promise<number> {
    return await this.txHost.tx.contentLike.count({
      where: {
        CultureContent: {
          deletedAt: null,
          acceptedAt: {
            not: null,
          },
        },
        userIdx: idx,
      },
    });
  }
}
