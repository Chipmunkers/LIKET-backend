import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyExistEmailException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
