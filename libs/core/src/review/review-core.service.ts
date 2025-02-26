import { Injectable } from '@nestjs/common';
import { ReviewCoreRepository } from 'libs/core/review/review-core.repository';

@Injectable()
export class ReviewCoreService {
  constructor(private readonly reviewCoreRepository: ReviewCoreRepository) {}
}
