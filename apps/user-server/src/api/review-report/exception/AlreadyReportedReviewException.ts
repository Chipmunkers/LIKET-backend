import { ConflictException } from '@nestjs/common';

export class AlreadyReportedReviewException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
