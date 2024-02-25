import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SignUpDto } from './dto/SignUpDto';
import { UserListPagenationDto } from './dto/UserListPaginationDto';
import { UpdatePwDto } from './dto/UpdatePwDto';
import { UserEntity } from './entity/UserEntity';
import { MyInfoEntity } from './entity/MyInfoEntity';
import { UpdateProfileDto } from './dto/UpdateProfileDto';
import { AuthService } from '../auth/auth.service';
import { DuplicateUserException } from './exception/DuplicateUserException';
import { HashService } from '../../common/service/hash.service';

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

  public getMyInfo: (userIdx: number) => Promise<MyInfoEntity>;

  public getUserByIdx: (userIdx: number) => Promise<UserEntity<'my', 'admin'>>;

  public getUserAll: (
    pagenation: UserListPagenationDto,
  ) => Promise<{ user: UserEntity<'my', 'admin'>[]; count: number }>;

  public updateProfile: (
    idx: number,
    updateDto: UpdateProfileDto,
  ) => Promise<void>;

  public updatePw: (idx: number, updateDto: UpdatePwDto) => Promise<void>;

  public blockUser: (idx: number) => Promise<void>;
}
