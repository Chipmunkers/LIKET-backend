import { DeepRequired } from 'libs/common';
import { ReviewInput } from 'libs/testing/seed/review/type/review.input';

/**
 * @author jochongs
 */
export type ReviewOutput = DeepRequired<ReviewInput> & { idx: number };
