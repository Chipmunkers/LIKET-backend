import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { CultureContentCoreRepository } from 'libs/core/culture-content/culture-content-core.repository';
import { AlreadyAcceptedCultureContentException } from 'libs/core/culture-content/exception/AlreadyAcceptedCultureContentException';
import { AlreadyRevokedCultureContentException } from 'libs/core/culture-content/exception/AlreadyRevokedCultureContentException';
import { CultureContentNotFoundException } from 'libs/core/culture-content/exception/CultureContentNotFoundException';
import { CreateCultureContentInput } from 'libs/core/culture-content/input/create-culture-content.input';
import { FindCultureContentAllInput } from 'libs/core/culture-content/input/find-culture-content-all.input';
import { FindLikedCultureContentAllInput } from 'libs/core/culture-content/input/find-liked-culture-content-all.input';
import { UpdateCultureContentInput } from 'libs/core/culture-content/input/update-culture-content.input';
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

  /**
   * 문화생활컨텐츠를 생성하는 메서드
   *
   * @author jochongs
   */
  @Transactional()
  public async createCultureContent(
    input: CreateCultureContentInput,
  ): Promise<CultureContentModel> {
    return CultureContentModel.fromPrisma(
      await this.cultureContentCoreRepository.insertCultureContent(input),
    );
  }

  /**
   * 식별자로 문화생활컨텐츠 수정 메서드
   *
   * @author jochongs
   */
  @Transactional()
  public async updateCultureContentByIdx(
    idx: number,
    input: UpdateCultureContentInput,
  ): Promise<void> {
    await this.cultureContentCoreRepository.updateCultureContentByIdx(
      idx,
      input,
    );
  }

  /**
   * 문화생활컨텐츠 활성화 메서드
   *
   * @author jochongs
   *
   * @throws {CultureContentNotFoundException} 404 - 컨텐츠를 찾을 수 없는 경우
   * @throws {AlreadyAcceptedCultureContentException} 409 - 이미 활성화된 컨텐츠일 경우
   */
  @Transactional()
  public async acceptCultureContentByIdx(idx: number): Promise<void> {
    const content =
      await this.cultureContentCoreRepository.selectCultureContentByIdx(idx);

    if (!content) {
      throw new CultureContentNotFoundException(idx);
    }

    if (content.acceptedAt) {
      throw new AlreadyAcceptedCultureContentException(idx);
    }

    await this.cultureContentCoreRepository.updateCultureContentByIdx(idx, {
      acceptedAt: new Date(),
    });
  }

  /**
   * 문화생활컨텐츠 비활성화 메서드
   *
   * @author jochongs
   *
   * @throws {CultureContentNotFoundException} 404 - 컨텐츠를 찾을 수 없는 경우
   * @throws {AlreadyRevokedCultureContentException} 409 - 컨텐츠가 이미 비활성화 되어있는 경우
   */
  @Transactional()
  public async revokeCultureContentByIdx(idx: number): Promise<void> {
    const content =
      await this.cultureContentCoreRepository.selectCultureContentByIdx(idx);

    if (!content) {
      throw new CultureContentNotFoundException(idx);
    }

    if (!content.acceptedAt) {
      throw new AlreadyRevokedCultureContentException(idx);
    }

    await this.cultureContentCoreRepository.updateCultureContentByIdx(idx, {
      acceptedAt: null,
    });
  }

  /**
   * 좋아요 누른 컨텐츠 목록 보기
   *
   * @author jochongs
   *
   * @param userIdx 조회하려는 사용자 인덱스
   */
  @Transactional()
  public async findLikedCultureContentAll(
    userIdx: number,
    input: FindLikedCultureContentAllInput,
  ): Promise<SummaryCultureContentModel[]> {
    return (
      await this.cultureContentCoreRepository.selectLikedCultureContentAll(
        userIdx,
        input,
      )
    ).map(SummaryCultureContentModel.fromLiked);
  }
}
