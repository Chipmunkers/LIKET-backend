import { ConflictException } from '@nestjs/common';

export class AlreadyNotLikeReviewExcpetion extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
