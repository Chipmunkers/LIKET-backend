import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { CultureContentCoreRepository } from 'libs/core/culture-content/culture-content-core.repository';
import { FindCultureContentAllInput } from 'libs/core/culture-content/input/find-culture-content-all.input';
import { CultureContentModel } from 'libs/core/culture-content/model/culture-content.model';
import { SummaryCultureContentModel } from 'libs/core/culture-content/model/summary-culture-content.model';

@Injectable()
export class CultureContentCoreService {
  constructor(
    private readonly cultureContentCoreRepository: CultureContentCoreRepository,
  ) {}

  /**
   * 문화생활컨텐츠를 검색하는 메서드
   *
   * @author jochongs
   */
  @Transactional()
  public async findCultureContentAll(
    input: FindCultureContentAllInput,
    readUser?: number,
  ): Promise<SummaryCultureContentModel[]> {
    return (
      await this.cultureContentCoreRepository.selectCultureContentAll(
        input,
        readUser,
      )
    ).map(SummaryCultureContentModel.fromPrisma);
  }

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
    readUser?: number,
  ): Promise<CultureContentModel | null> {
    const content =
      await this.cultureContentCoreRepository.selectCultureContentByIdx(
        idx,
        readUser,
      );

    return content && CultureContentModel.fromPrisma(content);
  }

  /**
   * id를 통해 문화생활컨텐츠를 탐색하는 메서드
   *
   * @author jochongs
   *
   * @param id 문화생활컨텐츠 아이디
   * @param readUser 조회한 사용자 인덱스
   */
  @Transactional()
  public async findCultureContentById(
    id: string,
    readUser?: number,
  ): Promise<CultureContentModel | null> {
    const content =
      await this.cultureContentCoreRepository.selectCultureContentById(
        id,
        readUser,
      );

    return content && CultureContentModel.fromPrisma(content);
  }

  /**
   * idx를 통해 문화생활컨텐츠의 리뷰 개수를 가져오는 메서드
   *
   * @author jochongs
   *
   * @param idx 컨텐츠 식별자
   */
  @Transactional()
  public async getCultureContentReviewCountByIdx(idx: number): Promise<number> {
    return await this.cultureContentCoreRepository.selectReviewCountByIdx(idx);
  }

  /**
   * idx를 통해 문화생활컨텐츠의 총 별점 개수를 가져오는 메서드
   *
   * @author jochongs
   *
   * @param idx 컨텐츠 식별자
   */
  @Transactional()
  public async getCultureContentStarCountByIdx(idx: number): Promise<number> {
    return await this.cultureContentCoreRepository.selectTotalStarCountByIdx(
      idx,
    );
  }
}
