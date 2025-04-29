import { Injectable } from '@nestjs/common';
import { TagEntity } from './entity/tag.entity';
import { GenreCoreService } from 'libs/core/tag-root/genre/genre-core.service';
import { AgeCoreService } from 'libs/core/tag-root/age/age-core.service';
import { StyleCoreService } from 'libs/core/tag-root/style/style-core.service';

@Injectable()
export class ContentTagService {
  constructor(
    private readonly genreCoreService: GenreCoreService,
    private readonly ageCoreService: AgeCoreService,
    private readonly styleCoreService: StyleCoreService,
  ) {}

  /**
   * 장르 목록 가져오기
   *
   * @author jochongs
   */
  public async getGenreAll(): Promise<{
    tagList: TagEntity[];
  }> {
    const genreList = await this.genreCoreService.findGenreAll();

    return { tagList: genreList.map(TagEntity.fromModel) };
  }

  /**
   * 연령대 목록 가져오기
   *
   * @author jochongs
   */
  public async getAgeAll(): Promise<{
    tagList: TagEntity[];
  }> {
    const ageList = await this.ageCoreService.findAgeAll();

    return { tagList: ageList.map(TagEntity.fromModel) };
  }

  /**
   * 스타일 목록 가져오기
   *
   * @author jochongs
   */
  public async getStyleAll(): Promise<{
    tagList: TagEntity[];
  }> {
    const styleList = await this.styleCoreService.selectStyleAll();

    return { tagList: styleList.map(TagEntity.fromModel) };
  }
}
