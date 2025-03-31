import { JwtService } from '@nestjs/jwt';
import { InvalidEmailJwtException } from './exception/InvalidEmailJwtException';
import { EmailJwtPayload } from './model/email-jwt-payload';
import { EmailCertType } from './model/email-cert-type';

export class EmailJwtService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 이메일 토큰을 검증하여 이메일을 리턴하는 메서드
   *
   * @author jochongs
   *
   * @returns 이메일
   */
  public async verify(jwt: string, type: EmailCertType): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync<EmailJwtPayload>(jwt);

      if (payload.type !== type) {
        throw new InvalidEmailJwtException('Invalid email certification type');
      }

      return payload.email;
    } catch (err) {
      throw new InvalidEmailJwtException('Invalid email jwt');
    }
  }
}
