import { BadRequestException } from '@nestjs/common';

export class InvalidEmailVerificationCodeException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
