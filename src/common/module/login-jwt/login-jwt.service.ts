import { Injectable } from '@nestjs/common';
import { LoginJwtPayload } from './model/login-jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '../logger/logger.decorator';
import { LoggerService } from '../logger/logger.service';
import { InvalidLoginJwtException } from '../../../api/auth/exception/InvalidLoginJwtException';
import { RefreshTokenPayload } from './model/refresh-token-payload';
import { LoginJwtRepository } from './login-jwt.repository';
import { InvalidRefreshTokenException } from './exception/InvalidRefreshTokenException';
import { InvalidRefreshTokenType } from './exception/InvalidRefreshTokenType';
import { UtilService } from '../util/util.service';

@Injectable()
export class LoginJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly loginJwtRepository: LoginJwtRepository,
    private readonly utilService: UtilService,
    @Logger('LoginJwtService') private readonly logger: LoggerService,
  ) {}

  async verify(jwt: string): Promise<LoginJwtPayload> {
    try {
      this.logger.log(this.verify, 'Try to verify login jwt');
      return await this.jwtService.verifyAsync<LoginJwtPayload>(jwt);
    } catch (err) {
      this.logger.warn(this.verify, 'Attempt to verify invalid jwt');
      throw new InvalidLoginJwtException('Invalid login jwt');
    }
  }

  sign(idx: number, isAdmin: boolean): string {
    const payload: LoginJwtPayload = {
      idx: idx,
      isAdmin: isAdmin,
    };

    this.logger.log(this.sign, `Create login jwt | user = ${idx}`);
    return this.jwtService.sign(payload, {
      expiresIn: '30m',
    });
  }

  /**
   * Refresh Token 생성하기
   */
  async signRefreshToken(idx: number, isAdmin: boolean): Promise<string> {
    this.logger.log(this.signRefreshToken, 'Create login refresh token');

    const payload: RefreshTokenPayload = {
      idx: idx,
      isAdmin: isAdmin,
      type: 'Refresh',
    };

    const refreshToken = await this.jwtService.signAsync(
      {
        ...payload,
        jit: this.utilService.getUUID(),
      },
      {
        expiresIn: 10,
      },
    );

    console.log(refreshToken);

    await this.loginJwtRepository.save(idx, refreshToken);
    return refreshToken;
  }

  /**
   * Refresh Token 검증하기
   *
   * @param refreshToken 검증할 토큰
   * @param option
   */
  async verifyRefreshToken(
    refreshToken: string,
    option?: {
      delete: boolean;
    },
  ) {
    this.logger.log(this.verifyRefreshToken.name, 'Verify refresh token');
    let payload: RefreshTokenPayload | LoginJwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<
        RefreshTokenPayload | LoginJwtPayload
      >(refreshToken);
    } catch (err) {
      throw new InvalidRefreshTokenException(
        'Invalid refresh token',
        InvalidRefreshTokenType.INVALID_TOKEN,
      );
    }

    if (!this.isRefreshToken(payload)) {
      throw new InvalidRefreshTokenException(
        'Invalid refresh token',
        InvalidRefreshTokenType.INVALID_TOKEN,
      );
    }

    const isExpiredRefreshToken = await this.loginJwtRepository.find(
      refreshToken,
    );
    if (!isExpiredRefreshToken) {
      throw new InvalidRefreshTokenException(
        'Invalid refresh token',
        InvalidRefreshTokenType.INVALID_TOKEN,
      );
    }

    if (option?.delete) {
      await this.expireRefreshToken(refreshToken);
    }

    return payload;
  }

  public async expireRefreshToken(token?: string) {
    if (token) {
      await this.loginJwtRepository.delete(token);
    }
  }

  private isRefreshToken(
    payload: RefreshTokenPayload | LoginJwtPayload,
  ): payload is RefreshTokenPayload {
    if ((payload as RefreshTokenPayload).type === 'Refresh') {
      return true;
    }

    return false;
  }
}
