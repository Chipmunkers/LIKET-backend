import { CanActivate, Injectable, NotFoundException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class MetricWhitelistGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const whitelistServerIp = this.configService.get('whitelist');

    if (request.ip !== whitelistServerIp) {
      throw new NotFoundException('Not found exception');
    }

    return true;
  }
}
