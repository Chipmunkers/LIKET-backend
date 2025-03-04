import { Injectable } from '@nestjs/common';
import { ReviewLikeCoreRepository } from 'libs/core/review/review-like-core.repository';

@Injectable()
export class ReviewLikeCoreService {
  constructor(
    private readonly reviewLikeCoreRepository: ReviewLikeCoreRepository,
  ) {}
}
