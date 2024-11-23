import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoginJwtService } from '../module/login-jwt/login-jwt.service';
import { LoginJwtPayload } from '../module/login-jwt/model/login-jwt-payload';

@Injectable()
export class VerifyLoginJwtMiddleware implements NestMiddleware {
  constructor(private readonly loginJwtService: LoginJwtService) {}

  async use(
    req: Request & { jwtPayload: LoginJwtPayload },
    res: Response,
    next: NextFunction,
  ) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      return next();
    }

    try {
      req.jwtPayload = await this.loginJwtService.verify(token);

      next();
    } catch (err) {
      return next();
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer') {
      return null;
    }

    if (!token) {
      return null;
    }

    return token;
  }
}
