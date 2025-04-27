import { DeepRequired } from 'libs/common';
import { UserInput } from 'libs/testing/seed/user/type/user.input';

/**
 * @author jochongs
 */
export type UserOutput = DeepRequired<UserInput> & { idx: number };
