import { PickType } from '@nestjs/swagger';
import { InquiryAuthorModel } from 'libs/core/inquiry/model/inquiry-author.model';
import { InquiryImgModel } from 'libs/core/inquiry/model/inquiry-img.model';
import { InquiryTypeModel } from 'libs/core/inquiry/model/inquiry-type.mode';
import { InquiryModel } from 'libs/core/inquiry/model/inquiry.model';
import { SummaryInquirySelectField } from 'libs/core/inquiry/model/prisma/summary-inquiry-select-field';

/**
 * @author jochongs
 */
export class SummaryInquiryModel extends PickType(InquiryModel, [
  'idx',
  'title',
  'author',
  'imgList',
  'type',
  'createdAt',
]) {
  /** 답변 상태 */
  public readonly answerState: boolean;

  constructor(data: SummaryInquiryModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    inquiry: SummaryInquirySelectField,
  ): SummaryInquiryModel {
    return new SummaryInquiryModel({
      idx: inquiry.idx,
      type: InquiryTypeModel.fromPrisma(inquiry.InquiryType),
      imgList: inquiry.InquiryImg.map(InquiryImgModel.fromPrisma),
      author: InquiryAuthorModel.fromPrisma(inquiry.User),
      answerState: !!inquiry.Answer[0],
      title: inquiry.title,
      createdAt: inquiry.createdAt,
    });
  }
}
