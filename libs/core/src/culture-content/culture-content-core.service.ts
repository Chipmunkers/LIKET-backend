import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { CultureContentCoreRepository } from 'libs/core/culture-content/culture-content-core.repository';
import { CultureContentModel } from 'libs/core/culture-content/model/culture-content.model';

@Injectable()
export class CultureContentCoreService {
  constructor(
    private readonly cultureContentCoreRepository: CultureContentCoreRepository,
  ) {}

  /**
   * idx를 통해 문화생활컨텐츠를 탐색하는 메서드
   *
   * @author jochongs
   *
   * @param idx 문화생활컨텐츠 식별자
   * @param readUser 조회한 사용자 인덱스
   */
  @Transactional()
  public async findCultureContentByIdx(
    idx: number,
    readUser: number,
  ): Promise<CultureContentModel | null> {
    const content =
      await this.cultureContentCoreRepository.selectCultureContentByIdx(
        idx,
        readUser,
      );

    return content && CultureContentModel.fromPrisma(content);
  }
}
