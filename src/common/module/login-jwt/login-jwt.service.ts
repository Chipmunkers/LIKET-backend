import { Injectable } from '@nestjs/common';
import { LoginJwtPayload } from './model/login-jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '../logger/logger.decorator';
import { LoggerService } from '../logger/logger.service';
import { InvalidLoginJwtException } from '../../../api/auth/exception/InvalidLoginJwtException';
import { RefreshTokenPayload } from './model/refresh-token-payload';
import { InvalidRefreshTokenException } from './exception/InvalidRefreshTokenException';

@Injectable()
export class LoginJwtService {
  constructor(
    private readonly jwtService: JwtService,
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

  async signRefreshToken(idx: number, isAdmin: boolean): Promise<string> {
    this.logger.log(this.signRefreshToken.name, 'Create login refresh token');

    const payload: RefreshTokenPayload = {
      idx: idx,
      isAdmin: isAdmin,
      type: 'Refresh',
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: '14d',
    });
  }

  async verifyRefreshToken(refreshToken: string) {
    this.logger.log(this.verifyRefreshToken.name, 'Verify refresh token');

    const payload: RefreshTokenPayload | LoginJwtPayload =
      await this.jwtService.verifyAsync(refreshToken);

    if (!this.isRefreshToken(payload)) {
      throw new InvalidRefreshTokenException('Invalid refresh token');
    }

    return payload;
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
