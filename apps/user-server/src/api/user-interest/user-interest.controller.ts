import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuth } from 'apps/user-server/src/api/auth/login-auth.decorator';
import { LoginUser } from 'apps/user-server/src/api/auth/model/login-user';
import { UpdateUserInterestDto } from 'apps/user-server/src/api/user-interest/dto/update-interest.dto';
import { UserInterestService } from 'apps/user-server/src/api/user-interest/user-interest.service';
import { User } from 'apps/user-server/src/api/user/user.decorator';
import { Exception } from 'apps/user-server/src/common/decorator/exception.decorator';

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
  @HttpCode(200)
  @Exception(400, 'Invalid body')
  async updateUserInterest(
    @User() loginUser: LoginUser,
    @Body() updateInterestDto: UpdateUserInterestDto,
  ): Promise<void> {
    return await this.userInterestService.updateUserInterest(
      updateInterestDto,
      loginUser,
    );
  }
}
