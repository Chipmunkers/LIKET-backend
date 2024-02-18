import { UnauthorizedException } from '@nestjs/common';

export class InvalidEmailAuthTokenException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
