import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyExistContentException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
