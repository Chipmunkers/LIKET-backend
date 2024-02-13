import { Age, Genre, Style } from '@prisma/client';

export class TagEntity {
  idx: number;
  name: string;

  constructor(idx: number, name: string) {}

  static createTag(data: Age | Genre | Style): TagEntity {
    return new TagEntity(data.idx, data.name);
  }
}
