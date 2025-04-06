import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyUnpinnedNoticeException extends ConflictException {
  constructor(message?: string) {
    super(message);
  }
}
