import { Tos } from '@prisma/client';

export class TosEntity<T extends 'summary' | 'detail'> {
  idx: number;
  title: string;
  isEssential: boolean;

  contents: T extends 'detail' ? string : undefined;

  constructor(tos: {
    idx: number;
    title: string;
    isEssential: boolean;

    contents: T extends 'detail' ? string : undefined;
  }) {
    this.idx = tos.idx;
    this.title = tos.title;
    this.isEssential = tos.isEssential;
    this.contents = tos.contents;
  }

  static createUserSummaryTos(data: Tos): TosEntity<'summary'> {
    return new TosEntity({
      idx: data.idx,
      title: data.title,
      isEssential: data.isEssential,
      contents: undefined,
    });
  }

  static createUserDetailTos(data: Tos): TosEntity<'detail'> {
    return new TosEntity({
      idx: data.idx,
      title: data.title,
      isEssential: data.isEssential,
      contents: data.contents,
    });
  }
}
