import {
  CanActivate,
  Injectable,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { InvalidLoginJwtException } from './exception/InvalidLoginJwtException';
import { LoginJwtPayload } from '../../common/module/login-jwt/model/login-jwt-payload';
import { Response } from 'express';
import { PrismaProvider } from 'libs/modules';

@Injectable()
export class LoginAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaProvider) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();

    const payload: LoginJwtPayload | undefined = request.jwtPayload;

    if (!payload) {
      throw new InvalidLoginJwtException('Invalid login jwt');
    }

    const user = await this.prisma.user.findUnique({
      select: {
        blockedAt: true,
      },
      where: {
        idx: payload.idx,
        deletedAt: null,
      },
    });

    if (!user) {
      response.clearCookie('refreshToken');
      throw new InvalidLoginJwtException('Cannot find user');
    }

    if (user.blockedAt) {
      response.clearCookie('refreshToken');
      throw new HttpException('Suspended user', 418);
    }

    return true;
  }
}
