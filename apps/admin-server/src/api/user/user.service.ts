import { Injectable } from '@nestjs/common';
import { GetUserAllPagerbleDto } from './dto/request/get-user-all-pagerble.dto';
import { UserEntity } from './entity/user.entity';
import { BlockUserDto } from './dto/request/block-user.dto';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { AlreadyBlockUserException } from './exception/AlreadyBlockUserException';
import { AlreadyNotBlockUserException } from './exception/AlreadyNotBlockUserException';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaProvider) {}

  getUserAll: (pagerble: GetUserAllPagerbleDto) => Promise<{
    userList: UserEntity[];
    count: number;
  }> = async (pagerble) => {
    const [userList, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        include: {
          BlockReason: {
            orderBy: {
              idx: 'desc',
            },
          },
        },
        where: {
          nickname:
            pagerble.searchby === 'nickname'
              ? {
                  contains: pagerble.search || '',
                }
              : undefined,
          email:
            pagerble.searchby === 'email'
              ? {
                  contains: pagerble.search || '',
                }
              : undefined,
          blockedAt:
            pagerble.filterby !== undefined
              ? pagerble.filterby === 'block'
                ? { not: null }
                : null
              : undefined,
          deletedAt: null,
        },
        orderBy: {
          idx: pagerble.order,
        },
        take: 10,
        skip: (pagerble.page - 1) * 10,
      }),
      this.prisma.user.count({
        where: {
          nickname:
            pagerble.searchby === 'nickname'
              ? {
                  contains: pagerble.search || '',
                }
              : undefined,
          email:
            pagerble.searchby === 'email'
              ? {
                  contains: pagerble.search || '',
                }
              : undefined,
          blockedAt:
            pagerble.filterby !== undefined
              ? pagerble.filterby === 'block'
                ? { not: null }
                : null
              : undefined,
          deletedAt: null,
        },
      }),
    ]);

    return {
      userList: userList.map((user) => UserEntity.createEntity(user)),
      count,
    };
  };

  getUserContentsCount: (idx: number) => Promise<{
    reviewCount: number;
    liketCount: number;
  }> = async (idx) => {
    const reviewCount = await this.prisma.review.count({
      where: {
        userIdx: idx,
        CultureContent: {
          deletedAt: null,
        },
        deletedAt: null,
      },
    });

    return {
      reviewCount,
      // TODO: 라이켓 부착 필요
      liketCount: 0,
    };
  };

  getUserByIdx: (idx: number) => Promise<UserEntity> = async (idx) => {
    const user = await this.prisma.user.findUnique({
      include: {
        BlockReason: true,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new UserNotFoundException('Cannot find user');
    }

    return UserEntity.createEntity(user);
  };

  blockUserByIdx: (idx: number, blockDto: BlockUserDto) => Promise<void> =
    async (idx, blockDto) => {
      await this.prisma.$transaction(async (tx) => {
        const user = await this.prisma.user.findUnique({
          where: {
            idx,
            deletedAt: null,
          },
        });

        if (!user) {
          throw new UserNotFoundException('Cannot find user');
        }

        if (user.blockedAt) {
          throw new AlreadyBlockUserException('Already block user');
        }

        await this.prisma.user.update({
          where: {
            idx,
          },
          data: {
            blockedAt: new Date(),
          },
        });

        await this.prisma.blockReason.create({
          data: {
            userIdx: idx,
            reason: blockDto.reason,
          },
        });
      });

      return;
    };

  cancelToBlockUserByIdx: (idx: number) => Promise<void> = async (idx) => {
    await this.prisma.$transaction(async (tx) => {
      const user = await this.prisma.user.findUnique({
        where: {
          idx,
          deletedAt: null,
        },
      });

      if (!user) {
        throw new UserNotFoundException('Cannot find user');
      }

      if (!user.blockedAt) {
        throw new AlreadyNotBlockUserException('Already not block user');
      }

      await this.prisma.user.update({
        where: {
          idx,
        },
        data: {
          blockedAt: null,
        },
      });
    });

    return;
  };
}
