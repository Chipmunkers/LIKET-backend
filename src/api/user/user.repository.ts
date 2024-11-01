import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../common/module/logger/logger.service';
import { Logger } from '../../common/module/logger/logger.decorator';
import { Prisma, User } from '@prisma/client';
import { InsertUserDao } from './dao/insert-user.dao';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { UpdateUserDao } from './dao/update-user.dao';
import { SocialProvider } from '../auth/strategy/social-provider.enum';

@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(UserRepository.name) private readonly logger: LoggerService,
  ) {}

  public insertUser(
    dao: InsertUserDao,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    this.logger.log(this.insertUser, 'INSERT user');
    return (tx || this.prisma).user.create({
      data: {
        email: dao.email,
        pw: dao.pw,
        nickname: dao.nickname,
        birth: dao.birth,
        profileImgPath: dao.profileImgPath,
        provider: dao.provider,
        snsId: dao.snsId,
        gender: dao.gender,
      },
    });
  }

  public selectUserByEmail(
    email: string,
    tx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    this.logger.log(
      this.selectUserByEmail,
      `SELECT user WHERE email = ${email}`,
    );
    return (tx || this.prisma).user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  public selectUserByIdx(
    idx: number,
    tx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    this.logger.log(this.selectUserByIdx, `SELECT user WHERE idx = ${idx}`);
    return (tx || this.prisma).user.findUnique({
      where: {
        idx,
        deletedAt: null,
      },
    });
  }

  public selectMyUser(myIdx: number, tx?: Prisma.TransactionClient) {
    this.logger.log(this.selectMyUser, `SELECT my user WHERE idx = ${myIdx}`);
    return (tx || this.prisma).user.findFirst({
      include: {
        Review: {
          include: {
            ReviewImg: {
              where: {
                deletedAt: null,
              },
              orderBy: {
                idx: 'desc',
              },
              take: 10,
            },
            CultureContent: {
              include: {
                Genre: true,
                ContentImg: {
                  where: {
                    deletedAt: null,
                  },
                  orderBy: {
                    idx: 'desc',
                  },
                },
              },
            },
          },
          where: {
            deletedAt: null,
          },
          orderBy: {
            idx: 'desc',
          },
          take: 10,
        },
        Liket: {
          select: {
            idx: true,
            imgPath: true,
          },
          orderBy: {
            idx: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            Review: {
              where: {
                deletedAt: null,
              },
            },
            Liket: {
              where: {
                deletedAt: null,
              },
            },
            ContentLike: {
              where: {
                CultureContent: {
                  deletedAt: null,
                  acceptedAt: {
                    not: null,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        idx: myIdx,
        deletedAt: null,
      },
    });
  }

  public selectUserByNickname(
    nickname: string,
    tx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    this.logger.log(
      this.selectUserByEmail,
      `SELECT user WHERE nickname = ${nickname}`,
    );
    return (tx || this.prisma).user.findFirst({
      where: {
        nickname,
        deletedAt: null,
      },
    });
  }

  public selectSocialLoginUser(
    snsId: string,
    provider: SocialProvider,
    tx?: Prisma.TransactionClient,
  ) {
    this.logger.log(
      this.selectSocialLoginUser,
      `SELECT user WHERE snsId = ${snsId} AND provider = ${provider}`,
    );
    return (tx || this.prisma).user.findFirst({
      where: {
        snsId,
        provider,
        deletedAt: null,
      },
    });
  }

  public selectUserBySnsId(snsId: string, provider: SocialProvider) {
    this.logger.log(
      this.selectUserBySnsId,
      `SELECT user WHERE sns_id = ${snsId}`,
    );
    return this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        provider,
        snsId,
      },
    });
  }

  public updateUserByIdx(
    idx: number,
    updateDao: UpdateUserDao,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    this.logger.log(this.updateUserByIdx, `UPDATE user WHERE idx = ${idx}`);

    return (tx || this.prisma).user.update({
      where: {
        idx,
      },
      data: {
        nickname: updateDao.nickname,
        gender: updateDao.gender,
        birth: updateDao.birth,
        profileImgPath: updateDao.profileImgPath,
      },
    });
  }

  public updateUserLastLoginByIdx(idx: number) {
    return this.prisma.user.update({
      where: {
        idx,
      },
      data: {
        loginAt: new Date(),
      },
    });
  }

  public deleteUserLastLoginByIdx(idx: number) {
    return this.prisma.user.update({
      where: {
        idx,
      },
      data: {
        loginAt: null,
      },
    });
  }

  public deleteUserByIdx(idx: number, tx?: Prisma.TransactionClient) {
    this.logger.log(this.deleteUserByIdx, `DELETE user WHERE idx = ${idx}`);
    return this.prisma.user.update({
      where: {
        idx,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  public updateUserPwByIdx(idx: number, pw: string) {
    this.logger.log(
      this.updateUserPwByIdx,
      `UPDATE user password WHERE idx = ${idx}`,
    );
    return this.prisma.user.update({
      where: {
        idx,
      },
      data: {
        pw,
      },
    });
  }

  public updateProfileImgByUserIdx(idx: number, profileImg?: string) {
    return this.prisma.user.update({
      where: {
        idx,
      },
      data: {
        profileImgPath: profileImg || null,
      },
    });
  }
}
