import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/module/prisma/prisma.service';
import { TagEntity } from './entity/tag.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { ContentTagRepository } from './content-tag.repository';

@Injectable()
export class ContentTagService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentTagRepository: ContentTagRepository,
    @Logger(ContentTagService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 장르 목록 가져오기
   */
  public async getGenreAll(): Promise<{
    tagList: TagEntity[];
  }> {
    const genreList = await this.contentTagRepository.selectGenreAll();

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
    const ageList = await this.contentTagRepository.selectAgeAll();

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
    const styleList = await this.contentTagRepository.selectStyleAll();

    return {
      tagList: styleList.map((style) => TagEntity.createEntity(style)),
    };
  }
}
