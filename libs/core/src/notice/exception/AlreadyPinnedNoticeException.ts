import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyPinnedNoticeException extends ConflictException {
  constructor(message?: string) {
    super(message);
  }
}
