import { Answer } from '@prisma/client';

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

  static createEntity(answer: Answer): AnswerEntity {
    return new AnswerEntity({
      idx: answer.idx,
      contents: answer.contents,
      createdAt: answer.createdAt,
    });
  }
}
