import { InquiryType } from 'libs/core/inquiry/constant/inquiry-type';

export class CreateInquiryInput {
  title: string;
  contents: string;
  imgPathList: string[];
  typeIdx: InquiryType;
}
