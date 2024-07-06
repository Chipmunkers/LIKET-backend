import {
  CanActivate,
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { InvalidLoginJwtException } from './exception/InvalidLoginJwtException';
import { LoginJwtPayload } from '../../common/module/login-jwt/model/login-jwt-payload';
import { LoginUser } from './model/login-user';

@Injectable()
export class LoginAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

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
      throw new InvalidLoginJwtException('Cannot find user');
    }

    if (user.blockedAt) {
      throw new ForbiddenException('Suspended user');
    }

    const loginUser: LoginUser = {
      idx: payload.idx,
      isAdmin: payload.isAdmin,
    };

    request.user = loginUser;

    return true;
  }
}
