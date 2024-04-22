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
import { HashService } from '../../hash/hash.service';
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

  /**
   * Local user sign up
   */
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
        profileImgPath: signUpDto.profileImg?.filePath,
        gender: signUpDto.gender,
      },
    });

    const loginAccessToken = this.authService.signLoginAccessToken(
      signUpUser.idx,
      signUpUser.isAdmin,
    );

    return loginAccessToken;
  };

  /**
   * Get a login user's information
   */
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

  /**
   * Get a detail user data by idx
   */
  public getUserByIdx: (userIdx: number) => Promise<UserEntity<'my'>> = async (
    userIdx,
  ) => {
    const user = await this.prisma.user.findUnique({
      where: {
        idx: userIdx,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new UserNotFoundException('Cannot find user');
    }

    return UserEntity.createMyInfoEntity(user);
  };

  /**
   * Update a user's profile
   */
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
        profileImgPath: updateDto.profileImg?.filePath,
      },
    });
  };

  /**
   * Update user's login password
   */
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
}
