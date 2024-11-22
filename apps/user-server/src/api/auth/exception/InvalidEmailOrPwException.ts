import { UnauthorizedException } from '@nestjs/common';

export class InvalidEmailOrPwException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
