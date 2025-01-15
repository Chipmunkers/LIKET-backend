import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ContentTokenPayload } from 'apps/batch-server/src/content-token/type/content-token-payload';

@Injectable()
export class ContentTokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 토큰 생성하기
   *
   * @author jochongs
   */
  public async signToken(payload: ContentTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
  }

  /**
   * 토큰 검증하기
   *
   * @author jochongs
   */
  public async verifyToken(token: string): Promise<ContentTokenPayload> {
    return await this.jwtService.verifyAsync<ContentTokenPayload>(token);
  }
}
