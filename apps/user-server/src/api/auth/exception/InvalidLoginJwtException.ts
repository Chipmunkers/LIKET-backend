import { UnauthorizedException } from '@nestjs/common';

export class InvalidLoginJwtException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
