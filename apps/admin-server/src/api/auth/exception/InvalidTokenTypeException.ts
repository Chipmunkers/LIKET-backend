import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenTypeException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
