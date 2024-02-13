import { Answer } from '@prisma/client';

export class AnswerEntity<
  T extends { idx: number; contents: string; createdAt: Date } = {
    idx: number;
    contents: string;
    createdAt: Date;
  },
> {
  idx: number;
  contents: string;
  createdAt: Date;

  constructor(data: T) {
    this.idx = data.idx;
    this.contents = data.contents;
    this.createdAt = data.createdAt;
  }

  static createAnswer(answer: Answer): AnswerEntity {
    return new AnswerEntity({
      idx: answer.idx,
      contents: answer.contents,
      createdAt: answer.createdAt,
    });
  }
}
