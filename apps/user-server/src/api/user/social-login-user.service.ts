import { Injectable } from '@nestjs/common';
import { SocialLoginUser } from '../auth/model/social-login-user';
import { SocialProvider } from '../auth/strategy/social-provider.enum';
import { UserEntity } from './entity/user.entity';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { adjectives } from './data/adjectives';
import { animals } from './data/animals';
import { UserCoreService } from 'libs/core/user/user-core.service';
import { UserModel } from 'libs/core/user/model/user.model';

@Injectable()
export class SocialLoginUserService {
  constructor(private readonly userCoreService: UserCoreService) {}

  /**
   * 소셜사 제공 id로 사용자 찾기
   *
   * @author jochongs
   */
  public async getUserBySocialId(
    socialUser: SocialLoginUser,
    provider: SocialProvider,
  ): Promise<UserEntity> {
    const user = await this.userCoreService.findUserBySnsId(
      socialUser.id,
      provider,
    );

    if (!user) {
      throw new UserNotFoundException('Cannot find user');
    }

    return UserEntity.fromModel(user);
  }

  /**
   * 소셜 사용자 회원가입하기
   *
   * @author jochongs
   */
  public async signUpSocialUser(
    socialUser: SocialLoginUser,
  ): Promise<UserModel> {
    return await this.userCoreService.createUser({
      email: socialUser.email,
      provider: socialUser.provider,
      nickname: this.generateRandomNickname('-'),
      pw: 'social',
      birth: Number(socialUser.birth),
      gender: socialUser.gender || null,
      profileImgPath: null,
      snsId: socialUser.id,
      isAdmin: false,
    });
  }

  /**
   * 랜덤 닉네임 생성하기
   *
   * @param join 랜덤한 두 단어를 연결할 문자
   * @example generateRandomNickname("-") // 날렵한-다람쥐
   * @example generateRandomNickname(":") // 날렵한:다람쥐
   */
  private generateRandomNickname(join: string) {
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

    return randomAdjective + join + randomAnimal;
  }
}
