import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocialLoginUser } from '../../../api/auth/model/social-login-user';

@Injectable()
export class SocialLoginJwtService {
  constructor(private readonly jwtService: JwtService) {}

  public async sign(socialLoginUser: SocialLoginUser): Promise<string> {
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
    return await this.jwtService.verifyAsync<SocialLoginUser>(token);
  }
}
