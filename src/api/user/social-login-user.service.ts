import { Injectable } from '@nestjs/common';
import { SocialLoginUser } from '../auth/model/social-login-user';
import { SocialProvider } from '../auth/strategy/social-provider.enum';
import { UserEntity } from './entity/user.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { UserRepository } from './user.repository';

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
}
