import { PartialType } from '@nestjs/swagger';
import { CreateReviewInput } from 'libs/core/review/input/create-review.input';

/**
 * @author jochongs
 */
export class UpdateReviewInput extends PartialType(CreateReviewInput) {}
