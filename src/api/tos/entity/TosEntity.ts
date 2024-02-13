import { Tos } from '@prisma/client';

export class TosEntity<
  T extends 'summary' | 'detail',
  K extends 'user' | 'admin',
> {
  idx: number;
  title: string;
  isEssential: boolean;

  contents: T extends 'detail' ? string : undefined;

  updatedAt: K extends 'admin' ? Date : undefined;
  createdAt: K extends 'admin' ? Date : undefined;

  constructor(tos: {
    idx: number;
    title: string;
    isEssential: boolean;

    contents: T extends 'detail' ? string : undefined;

    updatedAt: K extends 'admin' ? Date : undefined;
    createdAt: K extends 'admin' ? Date : undefined;
  }) {
    this.idx = tos.idx;
    this.title = tos.title;
    this.isEssential = tos.isEssential;
    this.contents = tos.contents;
    this.updatedAt = tos.updatedAt;
    this.createdAt = tos.createdAt;
  }

  static createUserSummaryTos(data: Tos): TosEntity<'summary', 'user'> {
    return new TosEntity({
      idx: data.idx,
      title: data.title,
      isEssential: data.isEssential,
      contents: undefined,
      updatedAt: undefined,
      createdAt: undefined,
    });
  }

  static createAdminSummaryTos(data: Tos): TosEntity<'summary', 'admin'> {
    return new TosEntity({
      idx: data.idx,
      title: data.title,
      isEssential: data.isEssential,
      contents: undefined,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    });
  }

  static createUserDetailTos(data: Tos): TosEntity<'detail', 'user'> {
    return new TosEntity({
      idx: data.idx,
      title: data.title,
      isEssential: data.isEssential,
      contents: data.contents,
      updatedAt: undefined,
      createdAt: undefined,
    });
  }

  static createAdminDetailTos(data: Tos): TosEntity<'detail', 'admin'> {
    return new TosEntity({
      idx: data.idx,
      title: data.title,
      isEssential: data.isEssential,
      contents: data.contents,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    });
  }
}
