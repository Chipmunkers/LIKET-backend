import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyLikeContentException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
