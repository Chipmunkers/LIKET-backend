import { Prisma } from '@prisma/client';
import { PickType } from '@nestjs/swagger';
import { TagEntity } from '../../content-tag/entity/tag.entity';
import { ValidateNested } from 'class-validator';
import { ContentEntity } from './content.entity';

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

class HotCultureContent extends PickType(ContentEntity, [
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
  contentList: HotCultureContent[];

  constructor(data: HotCultureContentEntity) {
    super();
    Object.assign(this, data);
  }

  static createHotContent(genre: GenreWithInclude) {
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
