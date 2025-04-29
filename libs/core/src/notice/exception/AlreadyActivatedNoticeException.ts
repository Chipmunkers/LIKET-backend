import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyActivatedNoticeException extends ConflictException {
  constructor(message?: string) {
    super(message);
  }
}
