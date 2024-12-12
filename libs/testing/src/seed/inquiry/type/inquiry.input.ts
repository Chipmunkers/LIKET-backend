import { InquiryType } from 'libs/common/constants/inquiry-type';

/**
 * @author jochongs
 */
export type InquiryInput = {
  userIdx?: number;
  typeIdx?: InquiryType;
  contents?: string;
  deletedAt?: string | null;
};
