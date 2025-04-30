import { DeepRequired } from 'libs/common';
import { NoticeInput } from 'libs/testing/seed/notice/type/notice.input';

/**
 * @author jochongs
 */
export type NoticeOutput = DeepRequired<NoticeInput> & { idx: number };
