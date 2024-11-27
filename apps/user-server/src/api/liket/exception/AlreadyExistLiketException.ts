import { ConflictException } from '@nestjs/common';

/**
 * @author wherehows
 */
export class AlreadyExistLiketException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
