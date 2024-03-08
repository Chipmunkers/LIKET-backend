import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SignUpDto } from './dto/SignUpDto';
import { UserListPagenationDto } from './dto/UserListPaginationDto';
import { UpdatePwDto } from './dto/UpdatePwDto';
import { UserEntity } from './entity/UserEntity';
import { MyInfoEntity } from './entity/MyInfoEntity';
import { UpdateProfileDto } from './dto/UpdateProfileDto';
import { AuthService } from '../auth/auth.service';
import { DuplicateUserException } from './exception/DuplicateUserException';
import { HashService } from '../../common/service/hash.service';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { AlreadyBlockedUserException } from './exception/AlreadyBlockedUserException';
import { AlreadyNotBlockedUserException } from './exception/AlreadyNotBlockedUserException';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly hashService: HashService,
  ) {}

  public signUp: (signUpDto: SignUpDto) => Promise<string> = async (
    signUpDto,
  ) => {
    const email = this.authService.verifyEmailAuthToken(signUpDto.emailToken);

    const duplicatedUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            nickname: signUpDto.nickname,
          },
        ],
        deletedAt: null,
      },
    });

    if (duplicatedUser?.email === email) {
      throw new DuplicateUserException<'email'>(
        'This email is already in use',
        'email',
      );
    }

    if (duplicatedUser?.nickname === signUpDto.nickname) {
      throw new DuplicateUserException<'nickname'>(
        'This nickname is already in use',
        'nickname',
      );
    }

    const signUpUser = await this.prisma.user.create({
      data: {
        email,
        pw: this.hashService.hashPw(signUpDto.pw),
        nickname: signUpDto.nickname,
        birth: signUpDto.birth,
        profileImgPath: signUpDto.profileImg?.fileName,
        gender: signUpDto.gender,
      },
    });

    const loginAccessToken = this.authService.signLoginAccessToken(
      signUpUser.idx,
      signUpUser.isAdmin,
    );

    return loginAccessToken;
  };

  public getMyInfo: (userIdx: number) => Promise<MyInfoEntity> = async (
    userIdx,
  ) => {
    const user = await this.prisma.user.findFirst({
      include: {
        Review: {
          include: {
            ReviewImg: true,
          },
          where: {
            ReviewImg: {
              some: {
                deletedAt: null,
              },
            },
          },
        },
        Liket: {
          select: {
            idx: true,
            imgPath: true,
          },
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
          },
        },
      },
      where: {
        idx: userIdx,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new UserNotFoundException('Cannot find user');
    }

    return MyInfoEntity.createMyInfoEntity(user);
  };

  public getUserByIdx: (userIdx: number) => Promise<UserEntity<'my', 'admin'>> =
    async (userIdx) => {
      const user = await this.prisma.user.findUnique({
        where: {
          idx: userIdx,
          deletedAt: null,
        },
      });

      if (!user) {
        throw new UserNotFoundException('Cannot find user');
      }

      return UserEntity.createUserEntityForAdmin(user);
    };

  public getUserAll: (
    pagerble: UserListPagenationDto,
  ) => Promise<{ userList: UserEntity<'my', 'admin'>[]; count: number }> =
    async (pagerble) => {
      console.log(pagerble);
      const [userList, userCount] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          where: {
            deletedAt: null,
            nickname: pagerble.search
              ? {
                  contains: pagerble.search,
                }
              : undefined,
            blockedAt: pagerble.filter
              ? pagerble.filter === 'block'
                ? {
                    not: null,
                  }
                : null
              : undefined,
          },
          take: 10,
          skip: (pagerble.page - 1) * 10,
          orderBy: {
            idx: pagerble.order,
          },
        }),
        this.prisma.user.count({
          where: {
            deletedAt: null,
            nickname: pagerble.search
              ? {
                  contains: pagerble.search,
                }
              : undefined,
            blockedAt: pagerble.filter
              ? pagerble.filter === 'block'
                ? {
                    not: null,
                  }
                : null
              : undefined,
          },
        }),
      ]);

      return {
        userList: userList.map((user) =>
          UserEntity.createUserEntityForAdmin(user),
        ),
        count: userCount,
      };
    };

  public updateProfile: (
    idx: number,
    updateDto: UpdateProfileDto,
  ) => Promise<void> = async (idx, updateDto) => {
    const duplicatedUser = await this.prisma.user.findFirst({
      where: {
        nickname: updateDto.nickname,
        deletedAt: null,
      },
    });

    if (duplicatedUser) {
      throw new DuplicateUserException<'nickname'>(
        'This nickname is Duplicated',
        'nickname',
      );
    }

    await this.prisma.user.update({
      where: {
        idx,
      },
      data: {
        gender: updateDto.gender,
        birth: updateDto.birth,
        profileImgPath: updateDto.profileImg?.fileName,
      },
    });
  };

  public updatePw: (idx: number, updateDto: UpdatePwDto) => Promise<void> =
    async (idx, updateDto) => {
      await this.getUserByIdx(idx);

      await this.prisma.user.update({
        where: {
          idx,
        },
        data: {
          pw: this.hashService.hashPw(updateDto.pw),
        },
      });

      return;
    };

  public blockUser: (idx: number) => Promise<void> = async (idx) => {
    const user = await this.prisma.user.findUnique({
      select: {
        blockedAt: true,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new UserNotFoundException('Cannot find user');
    }

    if (user.blockedAt) {
      throw new AlreadyBlockedUserException('Already suspended user');
    }

    await this.prisma.user.update({
      where: {
        idx,
      },
      data: {
        blockedAt: new Date(),
      },
    });

    return;
  };

  public cancelToBlock: (idx: number) => Promise<void> = async (idx) => {
    const user = await this.prisma.user.findUnique({
      select: {
        blockedAt: true,
      },
      where: {
        idx,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new UserNotFoundException('Cannot find user');
    }

    if (!user.blockedAt) {
      throw new AlreadyNotBlockedUserException('Already not suspended user');
    }

    await this.prisma.user.update({
      where: {
        idx,
      },
      data: {
        blockedAt: null,
      },
    });

    return;
  };
}
