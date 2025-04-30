import { Injectable } from '@nestjs/common';
import { GenreCoreRepository } from 'libs/core/tag-root/genre/genre-core.repository';
import { GenreModel } from 'libs/core/tag-root/genre/model/genre.model';

@Injectable()
export class GenreCoreService {
  constructor(private readonly genreCoreRepository: GenreCoreRepository) {}

  /**
   * 장르 목록 가져오기
   *
   * @author jochongs
   */
  public async findGenreAll(): Promise<GenreModel[]> {
    return (
      await this.genreCoreRepository.selectGenreAll({
        order: 'asc',
        orderBy: 'idx',
      })
    ).map(GenreModel.fromPrisma);
  }
}
