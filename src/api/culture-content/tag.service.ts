import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TagEntity } from './entity/TagEntity';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  public async getGenreAll(): Promise<{
    tagList: TagEntity[];
  }> {
    const genreList = await this.prisma.genre.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'desc',
      },
    });

    return {
      tagList: genreList.map((tag) => TagEntity.createTag(tag)),
    };
  }

  public async getAgeAll(): Promise<{
    tagList: TagEntity[];
  }> {
    const ageList = await this.prisma.age.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'desc',
      },
    });

    return {
      tagList: ageList.map((age) => TagEntity.createTag(age)),
    };
  }

  public async getStyleAll(): Promise<{
    tagList: TagEntity[];
  }> {
    const styleList = await this.prisma.style.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        idx: 'desc',
      },
    });

    return {
      tagList: styleList.map((style) => TagEntity.createTag(style)),
    };
  }
}
