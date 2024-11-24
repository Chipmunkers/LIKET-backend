import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { NoTokenException } from './exception/NoTokenException';
import { InvalidTokenTypeException } from './exception/InvalidTokenTypeException';
import { TokenService } from '../../common/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    const payload = this.tokenService.verifyLoginAccessToken(token);

    request.user = payload;

    return true;
  }

  private extractToken(request: Request): string {
    const [tokenType, token] = request.headers?.authorization?.split(' ') || [];

    if (!tokenType || !token) {
      throw new NoTokenException('No token');
    }

    if (tokenType !== 'Bearer') {
      throw new InvalidTokenTypeException('Invalid token type');
    }

    return token;
  }
}
