/**
 * @author jochongs
 */
export type InquiryInput = {
  userIdx: number;
  typeIdx?: number;
  title?: string;
  contents?: string;
  deletedAt?: Date | null;
  imgList?: string[];
};
