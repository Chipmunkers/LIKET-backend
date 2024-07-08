import { Injectable } from '@nestjs/common';
import { LoginJwtPayload } from './model/login-jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '../logger/logger.decorator';
import { LoggerService } from '../logger/logger.service';
import { InvalidLoginJwtException } from '../../../api/auth/exception/InvalidLoginJwtException';
import { RefreshTokenPayload } from './model/refresh-token-payload';
import { InvalidRefreshTokenException } from './exception/InvalidRefreshTokenException';
import { PrismaService } from '../prisma/prisma.service';
import { LoginJwtRepository } from './login-jwt.repository';

@Injectable()
export class LoginJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly loginJwtRepository: LoginJwtRepository,
    @Logger('LoginJwtService') private readonly logger: LoggerService,
  ) {}

  verify: (jwt: string) => Promise<LoginJwtPayload> = async (jwt) => {
    try {
      return await this.jwtService.verifyAsync<LoginJwtPayload>(jwt);
    } catch (err) {
      throw new InvalidLoginJwtException('Invalid login jwt');
    }
  };

  sign: (idx: number, isAdmin: boolean) => string = (idx, isAdmin) => {
    this.logger.log('sign', 'create login access token');
    const payload: LoginJwtPayload = {
      idx: idx,
      isAdmin: isAdmin,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '30m',
    });
  };

  /**
   * Refresh Token 생성하기
   */
  async signRefreshToken(idx: number, isAdmin: boolean): Promise<string> {
    this.logger.log(this.signRefreshToken.name, 'Create login refresh token');

    const payload: RefreshTokenPayload = {
      idx: idx,
      isAdmin: isAdmin,
      type: 'Refresh',
    };

    const refreshToken = await this.jwtService.signAsync(
      {
        ...payload,
        iat: new Date().getTime(),
      },
      {
        expiresIn: '14d',
      },
    );

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
    const payload: RefreshTokenPayload | LoginJwtPayload =
      await this.jwtService.verifyAsync(refreshToken);

    if (!this.isRefreshToken(payload)) {
      throw new InvalidRefreshTokenException('Invalid refresh token');
    }

    const isExpiredRefreshToken = await this.loginJwtRepository.find(
      refreshToken,
    );
    if (!isExpiredRefreshToken) {
      throw new InvalidRefreshTokenException('Invalid refresh token');
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
