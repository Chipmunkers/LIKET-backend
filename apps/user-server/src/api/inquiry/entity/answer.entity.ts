import { Answer } from '@prisma/client';
import { InquiryAnswerModel } from 'libs/core/inquiry/model/inquiry-answer.model';

/**
 * @author jochongs
 */
export class AnswerEntity {
  /**
   * 답변 인덱스
   *
   * @example 1
   */
  public idx: number;

  /**
   * 답변 내용
   *
   * @example "해당 문의 내역은 확인중에 있습니다."
   */
  public contents: string;

  /**
   * 답변 날짜
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  public createdAt: Date;

  constructor(data: AnswerEntity) {
    Object.assign(this, data);
  }

  /**
   * `InquiryCoreModule`이 개발됨에 따라 deprecated되었습니다.
   * 대신, `fromModel` 정적 메서드를 사용하십시오.
   *
   * @deprecated
   */
  static createEntity(answer: Answer): AnswerEntity {
    return new AnswerEntity({
      idx: answer.idx,
      contents: answer.contents,
      createdAt: answer.createdAt,
    });
  }

  public static fromModel(answerModel: InquiryAnswerModel): AnswerEntity {
    return new AnswerEntity({
      idx: answerModel.idx,
      contents: answerModel.contents,
      createdAt: answerModel.createdAt,
    });
  }
}
