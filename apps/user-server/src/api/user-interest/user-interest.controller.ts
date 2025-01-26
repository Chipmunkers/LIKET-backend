import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuth } from 'apps/admin-server/src/api/auth/login-auth.decorator';
import { LoginUser } from 'apps/user-server/src/api/auth/model/login-user';
import { UserInterestService } from 'apps/user-server/src/api/user-interest/user-interest.service';
import { User } from 'apps/user-server/src/api/user/user.decorator';

@Controller('user-interest')
@ApiTags('User-Interest')
export class UserInterestController {
  constructor(private readonly userInterestService: UserInterestService) {}

  /**
   * 로그인 사용자의 관심 태그 생성/수정하기
   *
   * @author jochongs
   */
  @Post('/')
  @LoginAuth()
  async createUserInterest(@User() user: LoginUser): Promise<void> {}
}
