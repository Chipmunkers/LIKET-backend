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
}
