import { Injectable } from '@nestjs/common';
import { CreateUserInput } from 'libs/core/user/inputs/create-user.input';
import { UserSelectField } from 'libs/core/user/model/prisma/user-select-field';
import { UserProvider } from 'libs/core/user/model/provider.model';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class UserCoreRepository {
  constructor(private readonly prisma: PrismaProvider) {}

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
    return await this.prisma.user.findFirst({
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
   */
  public async selectUserByIdx(idx: number): Promise<UserSelectField | null> {
    return await this.prisma.user.findUnique({
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
   * INSERT user
   *
   * @author jochongs
   */
  public async insertUser(
    createUserInput: Omit<CreateUserInput, 'pw'> & {
      encryptedPw: string | null;
    },
  ): Promise<UserSelectField> {
    return await this.prisma.user.create({
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
}
