import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocialLoginUser } from '../../../api/auth/model/social-login-user';
import { Logger } from '../logger/logger.decorator';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class SocialLoginJwtService {
  constructor(
    private readonly jwtService: JwtService,
    @Logger(SocialLoginJwtService.name) private readonly logger: LoggerService,
  ) {}

  public async sign(socialLoginUser: SocialLoginUser): Promise<string> {
    this.logger.log(this.sign, 'Create social login token');
    return await this.jwtService.signAsync(
      {
        ...socialLoginUser,
      },
      {
        expiresIn: '1d',
      },
    );
  }

  public async verify(token: string): Promise<SocialLoginUser> {
    this.logger.log(this.verify, 'Verify social login token');
    return await this.jwtService.verifyAsync<SocialLoginUser>(token);
  }
}
