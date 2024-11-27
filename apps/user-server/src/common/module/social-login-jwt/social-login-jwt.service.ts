import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocialLoginUser } from '../../../api/auth/model/social-login-user';
import { Logger } from '../logger/logger.decorator';
import { LoggerService } from '../logger/logger.service';
import { InvalidSocialLoginJwtException } from './exception/InvalidSocialLoginJwtException';

@Injectable()
export class SocialLoginJwtService {
  constructor(
    private readonly jwtService: JwtService,
    @Logger(SocialLoginJwtService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 소셜 사용자 회원가입을 위한 토큰 발급
   * 소셜 회원가입 절차가 원터치로 변경됨에 따라 deprecated 되었습니다.
   *
   * @deprecated
   */
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

  /**
   * 소셜 회원가입시 소셜사 데이터를 보관한 토큰을 검증하기 위한 메서드
   * SocialLoginJwtService를 통해 검증
   * 소셜 회원가입 절차가 원터치로 변경됨에 따라 deprecated 되었습니다.
   *
   * @param token 소셜 사용자 회원가입을 위한 토큰
   * @returns 소셜 사용자 정보
   * @deprecated
   */
  public async verify(token: string): Promise<SocialLoginUser> {
    this.logger.log(this.verify, 'Verify social login token');
    try {
      return await this.jwtService.verifyAsync<SocialLoginUser>(token);
    } catch (err) {
      throw new InvalidSocialLoginJwtException('Invalid social login jwt');
    }
  }
}
