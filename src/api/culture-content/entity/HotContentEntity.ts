import { Prisma } from '@prisma/client';
import { ContentEntity } from './ContentEntity';
import { PickType } from '@nestjs/swagger';
import { TagEntity } from './TagEntity';
import { ValidateNested } from 'class-validator';

const GenreWithInclude = Prisma.validator<Prisma.GenreDefaultArgs>()({
  include: {
    CultureContent: {
      include: {
        ContentImg: true,
      },
    },
  },
});

type GenreWithInclude = Prisma.GenreGetPayload<typeof GenreWithInclude>;

class ContentPart extends PickType(ContentEntity<'detail', 'user'>, [
  'idx',
  'title',
  'startDate',
  'endDate',
  'thumbnail',
]) {}

export class HotCultureContentEntity extends PickType(TagEntity, [
  'idx',
  'name',
]) {
  @ValidateNested()
  contentList: ContentPart[];

  constructor(data: {
    idx: number;
    name: string;
    contentList: {
      idx: number;
      title: string;
      startDate: Date;
      endDate: Date;
      thumbnail: string | null;
    }[];
  }) {
    super();

    this.idx = data.idx;
    this.name = data.name;
    this.contentList = data.contentList;
  }

  static createHotContent(genre: GenreWithInclude): HotCultureContentEntity {
    return new HotCultureContentEntity({
      idx: genre.idx,
      name: genre.name,
      contentList: genre.CultureContent.map((content) => ({
        idx: content.idx,
        title: content.title,
        startDate: content.startDate,
        endDate: content.endDate,
        thumbnail: content.ContentImg[0]?.imgPath || null,
      })),
    });
  }
}
