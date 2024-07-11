import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdatePwDto } from './dto/update-pw.dto';
import { MyInfoEntity } from './entity/my-info.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DuplicateUserException } from './exception/DuplicateUserException';
import { HashService } from '../../common/module/hash/hash.service';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { UserEntity } from './entity/user.entity';
import { UploadedFileEntity } from '../upload/entity/uploaded-file.entity';
import { EmailJwtService } from '../email-cert/email-jwt.service';
import { EmailCertType } from '../email-cert/model/email-cert-type';
import { LoginJwtService } from '../../common/module/login-jwt/login-jwt.service';
import { SocialSignUpDto } from './dto/social-sign-up.dto';
import { SocialLoginJwtService } from '../../common/module/social-login-jwt/social-login-jwt.service';
import { EmailDuplicateException } from './exception/EmailDuplicateException';
import { EmailDuplicateCheckDto } from './dto/email-duplicate-check.dto';
import { LoginToken } from '../auth/model/login-token';
import { NicknameDuplicateCheckDto } from './dto/nickname-duplicate-check.dto';
import { NicknameDuplicateException } from './exception/NicknameDuplicateException';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
    private readonly emailJwtService: EmailJwtService,
    private readonly loginJwtService: LoginJwtService,
    private readonly socialLoginJwtService: SocialLoginJwtService,
    @Logger(UserService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 회원가입하기
   */
  public async signUp(
    signUpDto: SignUpDto,
    profileImg?: UploadedFileEntity,
  ): Promise<LoginToken> {
    const email = await this.emailJwtService.verify(
      signUpDto.emailToken,
      EmailCertType.SIGN_UP,
    );

    await this.checkEmailAndNicknameDuplicate(email, signUpDto.nickname);

    this.logger.log(this.signUp, 'INSERT user');
    const signUpUser = await this.prisma.user.create({
      data: {
        email,
        pw: this.hashService.hashPw(signUpDto.pw),
        nickname: signUpDto.nickname,
        birth: signUpDto.birth,
        profileImgPath: profileImg?.filePath || null,
        gender: signUpDto.gender,
      },
    });

    const accessToken = this.loginJwtService.sign(
      signUpUser.idx,
      signUpUser.isAdmin,
    );
    const refreshToken = await this.loginJwtService.signRefreshToken(
      signUpUser.idx,
      signUpUser.isAdmin,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 소셜 회원가입 하기
   */
  public async socialUserSignUp(
    signUpDto: SocialSignUpDto,
    profileImg?: UploadedFileEntity,
  ): Promise<LoginToken> {
    const socialUser = await this.socialLoginJwtService.verify(signUpDto.token);

    this.logger.log(
      this.socialUserSignUp,
      `duplicate check nickname = ${socialUser.nickname} | email = ${socialUser.email}`,
    );
    await this.checkEmailAndNicknameDuplicate(
      socialUser.email,
      signUpDto.nickname,
    );

    this.logger.log(this.socialUserSignUp, 'INSERT social user');
    const signUpUser = await this.prisma.user.create({
      data: {
        email: socialUser.email,
        pw: 'social',
        nickname: signUpDto.nickname,
        snsId: socialUser.id,
        birth: signUpDto.birth || null,
        gender: signUpDto.gender || null,
        profileImgPath: profileImg?.filePath || null,
        provider: socialUser.provider,
      },
    });

    const accessToken = this.loginJwtService.sign(
      signUpUser.idx,
      signUpUser.isAdmin,
    );
    const refreshToken = await this.loginJwtService.signRefreshToken(
      signUpUser.idx,
      signUpUser.isAdmin,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private async checkEmailAndNicknameDuplicate(
    email: string,
    nickname: string,
  ) {
    this.logger.log(this.checkEmailAndNicknameDuplicate, 'SELECT user');
    const duplicatedUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: email,
          },
          {
            nickname: nickname,
          },
        ],
        deletedAt: null,
      },
    });

    if (duplicatedUser?.email === email) {
      this.logger.warn(
        this.checkEmailAndNicknameDuplicate,
        'Attempt to sign up with duplicated email',
      );
      throw new DuplicateUserException<'email'>(
        'This email is already in use',
        'email',
      );
    }

    if (duplicatedUser?.nickname === nickname) {
      this.logger.warn(
        this.checkEmailAndNicknameDuplicate,
        'Attempt to sign up with duplicated nickname',
      );
      throw new DuplicateUserException<'nickname'>(
        'This nickname is already in use',
        'nickname',
      );
    }

    return;
  }

  /**
   * 내 정보 가져오기
   */
  public async getMyInfo(userIdx: number): Promise<MyInfoEntity> {
    this.logger.log(this.getMyInfo, `SELECT user ${userIdx}`);
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
      this.logger.warn(
        this.getMyInfo,
        `Attempt to find non-existent user ${userIdx}`,
      );
      throw new UserNotFoundException('Cannot find user');
    }

    return MyInfoEntity.createEntity(user);
  }

  /**
   * 특정 사용자 가져오기
   */
  public async getUserByIdx(userIdx: number): Promise<UserEntity> {
    this.logger.log(this.getUserByIdx, `SELECT user ${userIdx}`);
    const user = await this.prisma.user.findUnique({
      where: {
        idx: userIdx,
        deletedAt: null,
      },
    });

    if (!user) {
      this.logger.warn(
        this.getUserByIdx,
        `Attempt to find non-existent user ${userIdx}`,
      );
      throw new UserNotFoundException('Cannot find user');
    }

    return UserEntity.createEntity(user);
  }

  /**
   * 사용자 정보 변경하기
   */
  public async updateProfile(
    idx: number,
    updateDto: UpdateProfileDto,
  ): Promise<void> {
    this.logger.log(this.updateProfile, `SELECT user ${idx}`);
    const duplicatedUser = await this.prisma.user.findFirst({
      where: {
        nickname: updateDto.nickname,
        deletedAt: null,
      },
    });

    if (duplicatedUser) {
      this.logger.warn(
        this.updateProfile,
        'Attempt to update with duplicated nickname',
      );
      throw new DuplicateUserException<'nickname'>(
        'This nickname is Duplicated',
        'nickname',
      );
    }

    this.logger.log(this.updateProfile, `UPDATE user ${idx}`);
    await this.prisma.user.update({
      where: {
        idx,
      },
      data: {
        gender: updateDto.gender,
        birth: updateDto.birth,
        profileImgPath: updateDto.profileImg || null,
      },
    });
  }

  /**
   * 이메일 중복 검사 확인하기
   */
  public async checkEmailDuplicate(
    checkDto: EmailDuplicateCheckDto,
  ): Promise<void> {
    try {
      await this.getUserByEmail(checkDto.email);
    } catch (err) {
      return;
    }

    throw new EmailDuplicateException('duplicated email');
  }

  /**
   * 닉네임 중복 검사 확인하기
   */
  public async checkNicknameDuplicate(checkDto: NicknameDuplicateCheckDto) {
    try {
      await this.getUserByNickname(checkDto.nickname);
    } catch (err) {
      return;
    }

    throw new NicknameDuplicateException('duplicated nickname');
  }

  private async getUserByNickname(nickname: string) {
    this.logger.log(this.getUserByIdx, `SELECT user nickname = ${nickname}`);
    const user = await this.prisma.user.findFirst({
      where: {
        nickname,
        deletedAt: null,
      },
    });

    if (!user) {
      this.logger.log(
        this.getUserByIdx,
        `Attempt to find non-existent user ${nickname}`,
      );
      throw new UserNotFoundException('Cannot find user');
    }

    return UserEntity.createEntity(user);
  }

  public async getUserByEmail(email: string) {
    this.logger.log(this.getUserByEmail, `SELECT user email = ${email}`);
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (!user) {
      this.logger.warn(
        this.getUserByEmail,
        `Attempt to find non-existent user ${email}`,
      );
      throw new UserNotFoundException('Cannot find user');
    }

    return UserEntity.createEntity(user);
  }
}
