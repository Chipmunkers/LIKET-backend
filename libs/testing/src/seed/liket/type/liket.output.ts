import { DeepRequired } from 'libs/common';
import { LiketInput } from 'libs/testing/seed/liket/type/liket.input';

/**
 * @author jochongs
 */
export type LiketOutput = { idx: number } & DeepRequired<LiketInput>;
