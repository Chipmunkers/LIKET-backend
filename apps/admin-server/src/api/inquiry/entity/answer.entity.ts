import { Answer } from '@prisma/client';

export class AnswerEntity {
  /**
   * 답변 인덱스
   *
   * @example 81
   */
  public idx: number;

  /**
   * 답변 내용
   *
   * @example "안녕하세요. 성수 디올 팝업스토어 위치가 성동구가 아니라 성북구로 뜨는 오류를 확인했어요"
   */
  public contents: string;

  /**
   * 답변 생성일
   *
   * @example 2024-05-05T10:10:10.000Z
   */
  public createdAt: Date;

  constructor(data: AnswerEntity) {
    Object.assign(this, data);
  }

  static createEntity(answer: Answer) {
    return new AnswerEntity({
      idx: answer.idx,
      contents: answer.contents,
      createdAt: answer.createdAt,
    });
  }
}
