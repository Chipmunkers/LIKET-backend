import { Injectable } from '@nestjs/common';
import { SocialLoginUser } from '../auth/model/social-login-user';
import { SocialProvider } from '../auth/strategy/social-provider.enum';
import { UserEntity } from './entity/user.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { UserRepository } from './user.repository';
import { adjectives } from './data/adjectives';
import { animals } from './data/animals';

@Injectable()
export class SocialLoginUserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Logger(SocialLoginUserService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 소셜사 제공 id로 사용자 찾기
   */
  public async getUserBySocialId(
    socialUser: SocialLoginUser,
    provider: SocialProvider,
  ): Promise<UserEntity> {
    const user = await this.userRepository.selectUserBySnsId(
      socialUser.id,
      provider,
    );

    if (!user) {
      this.logger.warn(
        this.getUserBySocialId,
        `Attempt to find non-existent social user`,
      );
      throw new UserNotFoundException('Cannot find user');
    }

    return UserEntity.createEntity(user);
  }

  /**
   * 소셜 사용자 회원가입하기
   */
  public async signUpSocialUser(socialUser: SocialLoginUser) {
    return await this.userRepository.insertUser({
      email: socialUser.email,
      provider: socialUser.provider,
      nickname: this.generateRandomNickname('-'),
      pw: 'social',
      birth: Number(socialUser.birth),
      gender: socialUser.gender || null,
      profileImgPath: null,
      snsId: socialUser.id,
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
    const randomAnimal = animals[Math.floor(Math.random() * adjectives.length)];

    return randomAdjective + join + randomAnimal;
  }
}
