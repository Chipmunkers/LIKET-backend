import { InquiryAnswerSelectField } from 'libs/core/inquiry/model/prisma/inquiry-answer-select-field';

/**
 * @author jochongs
 */
export class InquiryAnswerModel {
  /** 문의 답변 식별자 */
  public readonly idx: number;

  /** 답변 내용 */
  public readonly contents: string;

  /** 답변 시간 */
  public readonly createdAt: Date;

  /** 문의 인덱스 */
  public readonly inquiryIdx: number;

  constructor(data: InquiryAnswerModel) {
    return Object.assign(this, data);
  }

  public static fromPrisma(
    answer: InquiryAnswerSelectField,
  ): InquiryAnswerModel {
    return new InquiryAnswerModel({
      idx: answer.idx,
      contents: answer.contents,
      createdAt: answer.createdAt,
      inquiryIdx: answer.inquiryIdx,
    });
  }
}
