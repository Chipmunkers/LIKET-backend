import { Injectable } from '@nestjs/common';
import { LoginJwtPayload } from './model/login-jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { InvalidLoginJwtException } from './exception/InvalidLoginJwtException';

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
      expiresIn: '14d',
    });
  };
}
