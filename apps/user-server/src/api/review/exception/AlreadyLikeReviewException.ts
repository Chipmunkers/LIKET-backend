import { ConflictException } from '@nestjs/common';

export class AlreadyLikeReviewException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
