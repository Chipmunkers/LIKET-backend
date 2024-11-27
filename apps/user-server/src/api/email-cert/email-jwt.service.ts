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
   * 이메일 토큰을 검증하여 이메일을 리턴하는 메서드
   *
   * @author jochongs
   *
   * @returns 이메일
   */
  public async verify(jwt: string, type: EmailCertType): Promise<string> {
    try {
      this.logger.log(this.verify, 'Verify jwt');
      const payload = await this.jwtService.verifyAsync<EmailJwtPayload>(jwt);

      if (payload.type !== type) {
        this.logger.warn(this.verify, 'Attempt to verify invalid jwt');
        throw new InvalidEmailJwtException('Invalid email certification type');
      }

      return payload.email;
    } catch (err) {
      this.logger.error(
        this.verify,
        `Fail to verify email jwt cause: ${err.message}`,
        err,
      );
      throw new InvalidEmailJwtException('Invalid email jwt');
    }
  }
}
