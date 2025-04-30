import { DeepRequired } from 'libs/common';
import { BannerInput } from 'libs/testing/seed/banner/type/banner.input';

/**
 * @author jochongs
 */
export type BannerOutput = DeepRequired<BannerInput> & {
  idx: number;
};
