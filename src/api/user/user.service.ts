import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
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
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { LoginUser } from '../auth/model/login-user';
import { WithdrawalDto } from './dto/withdrawal.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
    private readonly emailJwtService: EmailJwtService,
    private readonly loginJwtService: LoginJwtService,
    private readonly socialLoginJwtService: SocialLoginJwtService,
    private readonly userRepository: UserRepository,
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

    await this.checkEmailDuplicate({ email });

    const signUpUser = await this.userRepository.insertUser({
      email,
      pw: this.hashService.hashPw(signUpDto.pw),
      nickname: signUpDto.nickname,
      birth: signUpDto.birth || null,
      profileImgPath: profileImg?.filePath || null,
      gender: signUpDto.gender || null,
      snsId: null,
      provider: 'local',
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
      `duplicate check | email = ${socialUser.email}`,
    );
    await this.checkEmailDuplicate({ email: socialUser.email });

    const signUpUser = await this.userRepository.insertUser({
      email: socialUser.email,
      pw: 'social',
      nickname: signUpDto.nickname,
      snsId: socialUser.id,
      birth: signUpDto.birth || null,
      gender: signUpDto.gender || null,
      profileImgPath: profileImg?.filePath || null,
      provider: socialUser.provider,
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
   * 내 정보 가져오기
   */
  public async getMyInfo(userIdx: number): Promise<MyInfoEntity> {
    const user = await this.userRepository.selectMyUser(userIdx);

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
   * 프로필 이미지 수정하기
   */
  public async updateProfileImg(loginUser: LoginUser, profileImgPath?: string) {
    await this.userRepository.updateProfileImgByUserIdx(
      loginUser.idx,
      profileImgPath,
    );
  }

  /**
   * 특정 사용자 가져오기
   */
  public async getUserByIdx(userIdx: number): Promise<UserEntity> {
    const user = await this.userRepository.selectUserByIdx(userIdx);

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
    await this.userRepository.updateUserByIdx(idx, {
      nickname: updateDto.nickname,
      gender: updateDto.gender || null,
      birth: updateDto.birth || null,
      profileImgPath: updateDto.profileImg || null,
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

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.selectUserByEmail(email);

    if (!user) {
      this.logger.warn(
        this.getUserByEmail,
        `Attempt to find non-existent user ${email}`,
      );
      throw new UserNotFoundException('Cannot find user');
    }

    return UserEntity.createEntity(user);
  }

  /**
   * 회원탈퇴 하기
   */
  public async withdrawal(
    loginUser: LoginUser,
    withdrawalDto: WithdrawalDto,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await this.userRepository.deleteUserByIdx(loginUser.idx, tx);

      // TODO: repository 패턴으로 변경 필요
      await this.prisma.deleteUserReason.create({
        data: {
          idx: loginUser.idx,
          contents: withdrawalDto.contents,
          typeIdx: withdrawalDto.type,
        },
      });
    });
  }
}
