import { ForbiddenException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class ReviewReportPermissionDeniedException extends ForbiddenException {
  constructor(message?: string) {
    super(message);
  }
}
