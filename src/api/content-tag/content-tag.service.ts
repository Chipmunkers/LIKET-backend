import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { TagEntity } from './entity/tag.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';

@Injectable()
export class ContentTagService {
  constructor(
    private readonly prisma: PrismaService,
    @Logger(ContentTagService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 장르 목록 가져오기
   */
  public async getGenreAll(): Promise<{
    tagList: TagEntity[];
  }> {
    this.logger.log(this.getGenreAll, 'SELECT genres');
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
   * 연령대 목록 가져오기
   */
  public async getAgeAll(): Promise<{
    tagList: TagEntity[];
  }> {
    this.logger.log(this.getAgeAll, 'SELECT ages');
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
   * 스타일 목록 가져오기
   */
  public async getStyleAll(): Promise<{
    tagList: TagEntity[];
  }> {
    this.logger.log(this.getStyleAll, 'SELECT styles');
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
