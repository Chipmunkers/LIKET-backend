import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyReportedReviewException extends ConflictException {
  constructor(message?: string) {
    super(message);
  }
}
