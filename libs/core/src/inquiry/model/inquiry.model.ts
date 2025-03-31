import { InquiryAnswerModel } from 'libs/core/inquiry/model/inquiry-answer.model';
import { InquiryAuthorModel } from 'libs/core/inquiry/model/inquiry-author.model';
import { InquiryImgModel } from 'libs/core/inquiry/model/inquiry-img.model';
import { InquiryTypeModel } from 'libs/core/inquiry/model/inquiry-type.mode';
import { InquirySelectField } from 'libs/core/inquiry/model/prisma/inquiry-select-field';

/**
 * @author jochongs
 */
export class InquiryModel {
  /** 문의 식별자 */
  public readonly idx: number;

  /** 문의 유형 */
  public readonly type: InquiryTypeModel;

  /** 문의 작성자 */
  public readonly author: InquiryAuthorModel;

  /** 문의 이미지 목록 */
  public readonly imgList: InquiryImgModel[];

  /** 문의 제목 */
  public readonly title: string;

  /** 문의 내용 */
  public readonly contents: string;

  /** 문의 생성 시간 */
  public readonly createdAt: Date;

  /** 답변 여부 */
  public readonly answerList: InquiryAnswerModel[];

  constructor(data: InquiryModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(inquiry: InquirySelectField): InquiryModel {
    return new InquiryModel({
      idx: inquiry.idx,
      type: InquiryTypeModel.fromPrisma(inquiry.InquiryType),
      imgList: inquiry.InquiryImg.map(InquiryImgModel.fromPrisma),
      author: InquiryAuthorModel.fromPrisma(inquiry.User),
      answerList: inquiry.Answer.map(InquiryAnswerModel.fromPrisma),
      title: inquiry.title,
      contents: inquiry.contents,
      createdAt: inquiry.createdAt,
    });
  }
}
