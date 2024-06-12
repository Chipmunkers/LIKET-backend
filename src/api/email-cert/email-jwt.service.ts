import { JwtService } from '@nestjs/jwt';
import { InvalidEmailJwtException } from './exception/InvalidEmailJwtException';
import { EmailJwtPayload } from './model/email-jwt-payload';
import { EmailCertType } from './model/email-cert-type';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

export class EmailJwtService {
  constructor(
    private readonly jwtService: JwtService,
    @Logger('EmailJwtService') private readonly logger: LoggerService,
  ) {}

  /**
   * @returns 이메일
   */
  verify: (jwt: string, type: EmailCertType) => Promise<string> = async (
    jwt,
    type,
  ) => {
    try {
      const payload = await this.jwtService.verifyAsync<EmailJwtPayload>(jwt);

      if (payload.type !== type) {
        throw new InvalidEmailJwtException('Invalid email certification type');
      }

      return payload.email;
    } catch (err) {
      this.logger.log(
        'verify',
        `Fail to verify email jwt cause: ${err.message}`,
      );
      throw new InvalidEmailJwtException('Invalid email jwt');
    }
  };
}
