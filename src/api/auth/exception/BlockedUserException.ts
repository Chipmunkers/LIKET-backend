import { ForbiddenException } from '@nestjs/common';

export class BlockedUserException extends ForbiddenException {
  constructor(message: string) {
    super(message);
  }
}
