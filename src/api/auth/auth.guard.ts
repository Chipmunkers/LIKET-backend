import {
  CanActivate,
  Injectable,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { InvalidLoginJwtException } from './exception/InvalidLoginJwtException';
import { LoginJwtPayload } from '../../common/module/login-jwt/model/login-jwt-payload';
import { Response } from 'express';

@Injectable()
export class LoginAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
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
      throw new HttpException('Suspended user', 423);
    }

    return true;
  }
}
