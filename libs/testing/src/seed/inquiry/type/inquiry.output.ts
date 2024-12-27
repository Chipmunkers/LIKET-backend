import { DeepRequired } from 'libs/common';
import { InquiryInput } from 'libs/testing/seed/Inquiry/type/inquiry.input';

/**
 * @author jochongs
 */
export type InquiryOutput = DeepRequired<InquiryInput> & { idx: number };
