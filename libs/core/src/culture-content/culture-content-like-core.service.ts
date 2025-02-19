import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { CultureContentCoreRepository } from 'libs/core/culture-content/culture-content-core.repository';
import { CultureContentLikeCoreRepository } from 'libs/core/culture-content/culture-content-like-core.repository';
import { AlreadyLikedCultureContentException } from 'libs/core/culture-content/exception/AlreadyLikedCultureContentException';
import { CultureContentNotFoundException } from 'libs/core/culture-content/exception/CultureContentNotFoundException';

@Injectable()
export class CultureContentLikeCoreService {
  constructor(
    private readonly cultureContentLikeCoreRepository: CultureContentLikeCoreRepository,
    private readonly cultureContentCoreRepository: CultureContentCoreRepository,
  ) {}

  /**
   * 컨텐츠 좋아요 하기 메서드
   *
   * @author jochongs
   *
   * @param userIdx 좋아요 누른 사용자 인덱스
   * @param contentIdx 컨텐츠 인덱스
   *
   * @throws {CultureContentNotFoundException} 404 - 좋아요 누를 컨텐츠가 존재하지 않는 경우
   * @throws {AlreadyLikedCultureContentException} 409 - 이미 userIdx 사용자가 contentIdx 컨텐츠를 좋아요 누른 경우
   */
  @Transactional()
  public async likeCultureContentByIdx(
    userIdx: number,
    contentIdx: number,
  ): Promise<void> {
    const content =
      await this.cultureContentCoreRepository.selectCultureContentByIdx(
        contentIdx,
        userIdx,
      );

    if (!content) {
      throw new CultureContentNotFoundException(contentIdx);
    }

    if (content.ContentLike.length !== 0) {
      throw new AlreadyLikedCultureContentException(contentIdx, userIdx);
    }

    await this.cultureContentLikeCoreRepository.selectCultureContentLike(
      contentIdx,
      userIdx,
    );
    await this.cultureContentLikeCoreRepository.increaseCultureContentLikeCountByIdx(
      contentIdx,
    );
  }
}
