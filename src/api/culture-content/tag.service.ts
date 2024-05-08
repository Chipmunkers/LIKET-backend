import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TagEntity } from './entity/tag.entity';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all tags of the genre
   */
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
      tagList: genreList.map((tag) => TagEntity.createEntity(tag)),
    };
  }

  /**
   * Get all tags of age
   */
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
      tagList: ageList.map((age) => TagEntity.createEntity(age)),
    };
  }

  /**
   * Get all tags of the style
   */
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
      tagList: styleList.map((style) => TagEntity.createEntity(style)),
    };
  }
}
