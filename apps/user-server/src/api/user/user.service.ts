import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { MyInfoEntity } from './entity/my-info.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { UserEntity } from './entity/user.entity';
import { UploadedFileEntity } from '../upload/entity/uploaded-file.entity';
import { EmailJwtService } from '../email-cert/email-jwt.service';
import { EmailCertType } from '../email-cert/model/email-cert-type';
import { LoginJwtService } from '../../common/module/login-jwt/login-jwt.service';
import { EmailDuplicateException } from './exception/EmailDuplicateException';
import { EmailDuplicateCheckDto } from './dto/email-duplicate-check.dto';
import { LoginToken } from '../auth/model/login-token';
import { LoginUser } from '../auth/model/login-user';
import { WithdrawalDto } from './dto/withdrawal.dto';
import { LiketRepository } from '../liket/liket.repository';
import { SummaryLiketEntity } from '../liket/entity/summary-liket.entity';
import { UserCoreService } from 'libs/core/user/user-core.service';
import { ReviewCoreService } from 'libs/core/review/review-core.service';
import { ReviewEntity } from 'apps/user-server/src/api/review/entity/review.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly emailJwtService: EmailJwtService,
    private readonly loginJwtService: LoginJwtService,
    private readonly liketRepository: LiketRepository,
    private readonly userCoreService: UserCoreService,
    private readonly reviewCoreService: ReviewCoreService,
  ) {}

  /**
   * 회원가입하기
   *
   * @author jochongs
   */
  public async signUp(
    signUpDto: SignUpDto,
    profileImg?: UploadedFileEntity,
  ): Promise<LoginToken> {
    const email = await this.emailJwtService.verify(
      signUpDto.emailToken,
      EmailCertType.SIGN_UP,
    );

    const signUpUser = await this.userCoreService.createUser({
      email,
      pw: signUpDto.pw,
      nickname: signUpDto.nickname,
      birth: signUpDto.birth || null,
      profileImgPath: profileImg?.filePath || null,
      gender: signUpDto.gender || null,
      snsId: null,
      provider: 'local',
      isAdmin: false,
    });

    const accessToken = this.loginJwtService.sign(
      signUpUser.idx,
      signUpUser.isAdmin,
    );
    const refreshToken = await this.loginJwtService.signRefreshToken(
      signUpUser.idx,
      signUpUser.isAdmin,
    );
    await this.userCoreService.updateUserLastLoginByIdx(signUpUser.idx);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 내 정보 가져오기
   *
   * @author wherehows
   *
   * @param userIdx 로그인 사용자 인덱스
   */
  public async getMyInfo(userIdx: number): Promise<MyInfoEntity> {
    const userModel = await this.userCoreService.findUserByIdx(userIdx);

    if (!userModel) {
      throw new UserNotFoundException('Cannot find user');
    }

    const liketList = (
      await this.liketRepository.selectLiketAll({
        user: userIdx,
        orderby: 'time',
        order: 'desc',
        page: 1,
      })
    ).map((liket) => SummaryLiketEntity.createEntity(liket));

    const liketCount =
      await this.liketRepository.selectLiketCountByUserIdx(userIdx);

    const reviewList = (
      await this.reviewCoreService.findReviewAll({
        page: 1,
        row: 10,
        userIdx,
        order: 'desc',
        orderBy: 'time',
      })
    ).map(ReviewEntity.fromModel);
    const reviewCount =
      await this.userCoreService.getReviewCountByUserIdx(userIdx);

    const contentLikeCount =
      await this.userCoreService.getContentLikeCountByUserIdx(userIdx);

    return MyInfoEntity.fromModel(
      userModel,
      liketList,
      liketCount,
      reviewList,
      reviewCount,
      contentLikeCount,
    );
  }

  /**
   * 프로필 이미지 수정하기
   *
   * @author jochongs
   */
  public async updateProfileImg(
    loginUser: LoginUser,
    profileImgPath: string | null,
  ) {
    await this.userCoreService.updateUserByIdx(loginUser.idx, {
      profileImgPath: profileImgPath,
    });
  }

  /**
   * 특정 사용자 가져오기
   *
   * @author jochongs
   */
  public async getUserByIdx(userIdx: number): Promise<UserEntity> {
    const user = await this.userCoreService.findUserByIdx(userIdx);

    if (!user) {
      throw new UserNotFoundException('Cannot find user');
    }

    return UserEntity.fromModel(user);
  }

  /**
   * 사용자 정보 변경하기
   *
   * @author jochongs
   */
  public async updateProfile(
    idx: number,
    updateDto: UpdateProfileDto,
  ): Promise<void> {
    await this.userCoreService.updateUserByIdx(idx, {
      nickname: updateDto.nickname,
      gender: updateDto.gender,
      birth: updateDto.birth,
      profileImgPath: updateDto.profileImg || null,
    });
  }

  /**
   * 이메일 중복 검사 확인하기
   *
   * @author jochongs
   *
   * @throws {EmailDuplicateException} 409 - 이미 해당 계정으로 가입된 계정이 존재하는 경우
   */
  public async checkEmailDuplicate(
    checkDto: EmailDuplicateCheckDto,
  ): Promise<void> {
    const user = await this.userCoreService.findUserByEmail(checkDto.email);

    if (user) {
      throw new EmailDuplicateException('duplicated email');
    }

    return;
  }

  /**
   * @author jochongs
   */
  public async getUserByEmail(email: string) {
    const user = await this.userCoreService.findUserByEmail(email);

    if (!user) {
      throw new UserNotFoundException('Cannot find user');
    }

    return UserEntity.fromModel(user);
  }

  /**
   * 회원탈퇴 하기
   *
   * @author jochongs
   */
  public async withdrawal(
    loginUser: LoginUser,
    withdrawalDto: WithdrawalDto,
  ): Promise<void> {
    await this.userCoreService.withdrawalUserByIdx(loginUser.idx, {
      typeIdx: withdrawalDto.type,
      contents: withdrawalDto.contents,
    });
  }
}
