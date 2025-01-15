import { UnauthorizedException } from '@nestjs/common';

export class InvalidContentToken extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
