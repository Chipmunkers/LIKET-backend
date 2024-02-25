import {
  ContextType,
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { GuardsConsumer } from '@nestjs/core/guards';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../api/auth/auth.service';
import { InvalidLoginAccessTokenException } from '../../api/auth/exception/InvalidLoginAccessTokenException';

@Injectable()
export class LoginAuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Cannot find token');
    }

    const payload = this.authService.verifyLoginAccessToken(token);

    const user = await this.prisma.user.findUnique({
      where: {
        idx: payload.idx,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new InvalidLoginAccessTokenException('Cannot find user');
    }

    if (user.blockedAt) {
      throw new ForbiddenException('Suspended user');
    }

    request.user = {
      idx: payload.idx,
      isAdmin: payload.isAdmin,
    };

    return true;
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
