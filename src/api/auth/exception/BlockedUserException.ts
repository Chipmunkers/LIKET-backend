import { HttpException } from '@nestjs/common';

export class BlockedUserException extends HttpException {
  constructor(message: string) {
    super(message, 418);
  }
}
