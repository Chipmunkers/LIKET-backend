import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { SocialLoginUser } from '../auth/model/social-login-user';
import { SocialProvider } from '../auth/strategy/social-provider.enum';
import { UserEntity } from './entity/user.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { UserNotFoundException } from './exception/UserNotFoundException';

@Injectable()
export class SocialLoginUserService {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(SocialLoginUserService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 소셜사 제공 id로 사용자 찾기
   */
  public async getUserBySocialId(
    socialUser: SocialLoginUser,
    provider: SocialProvider,
  ): Promise<UserEntity> {
    this.logger.log(
      this.getUserBySocialId,
      `SELECT user sns_id = ${socialUser.id}`,
    );
    const user = await this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        provider,
        snsId: socialUser.id,
      },
    });

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
