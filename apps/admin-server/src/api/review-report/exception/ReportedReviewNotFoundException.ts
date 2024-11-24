import { NotFoundException } from '@nestjs/common';

export class ReportedReviewNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
