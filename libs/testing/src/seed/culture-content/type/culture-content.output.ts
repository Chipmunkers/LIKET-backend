import { DeepRequired } from 'libs/common';
import { CultureContentInput } from 'libs/testing/seed/culture-content/type/culture-content.input';

/**
 * @author jochongs
 */
export type CultureContentOutput = DeepRequired<CultureContentInput> & {
  idx: number;
};
