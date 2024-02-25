import { UnauthorizedException } from '@nestjs/common';

export class InvalidLoginAccessTokenException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
