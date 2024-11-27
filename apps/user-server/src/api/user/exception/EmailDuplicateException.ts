import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class EmailDuplicateException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
