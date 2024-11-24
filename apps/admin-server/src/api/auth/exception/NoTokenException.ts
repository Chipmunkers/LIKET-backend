import { UnauthorizedException } from '@nestjs/common';

export class NoTokenException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
