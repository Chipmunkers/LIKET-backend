import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class InvalidEmailJwtException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
