import { Injectable } from '@nestjs/common';
import { CreateContentRequestDto } from './dto/create-content-request.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentPagerbleDto } from './dto/content-pagerble.dto';
import { ContentNotFoundException } from './exception/ContentNotFound';
import { AlreadyLikeContentException } from './exception/AlreadyLikeContentException';
import { AlreadyNotLikeContentException } from './exception/AlreadyNotLikeContentException';
import { ContentEntity } from './entity/content.entity';
import { SummaryContentEntity } from './entity/summary-content.entity';
import { LoginUser } from '../auth/model/login-user';
import { HotCultureContentEntity } from './entity/hot-content.entity';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { CultureContentRepository } from './culture-content.repository';
import { CultureContentLikeRepository } from './culture-content-like.repository';
import { ReviewRepository } from '../review/review.repository';
import { ContentTagRepository } from '../content-tag/content-tag.repository';
import { UserRepository } from '../user/user.repository';
import { TagEntity } from '../content-tag/entity/tag.entity';
import { LikeContentPagerbleDto } from './dto/like-content-pagerble.dto';
import { GenreWithHotContentEntity } from 'apps/user-server/src/api/culture-content/entity/genre-with-hot-content.entity';

@Injectable()
export class CultureContentService {
  constructor(
    private readonly cultureContentRepository: CultureContentRepository,
    private readonly cultureContentLikeRepository: CultureContentLikeRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly contentTagRepository: ContentTagRepository,
    private readonly userRepository: UserRepository,
    @Logger(CultureContentService.name) private readonly logger: LoggerService,
  ) {}

  /**
   * 컨텐츠 자세히보기
   *
   * @author jochongs
   */
  public async getContentByIdx(
    idx: number,
    loginUser?: LoginUser,
  ): Promise<ContentEntity> {
    const content =
      await this.cultureContentRepository.selectCultureContentByIdx(
        idx,
        loginUser?.idx,
      );

    if (!content) {
      throw new ContentNotFoundException('Cannot find content');
    }

    const reviewStar =
      await this.reviewRepository.selectReviewAvgStarRatingByContentIdx(
        content.idx,
      );

    return ContentEntity.createEntity(content, reviewStar._sum.starRating || 0);
  }

  /**
   * 컨텐츠 목록 보기
   *
   * @author jochongs
   */
  public async getContentAll(pagerble: ContentPagerbleDto, userIdx?: number) {
    const contentList =
      await this.cultureContentRepository.selectCultureContentAll(
        pagerble,
        userIdx,
      );

    return {
      contentList: contentList.map((content) =>
        SummaryContentEntity.createEntity(content),
      ),
    };
  }

  /**
   * 곧 오픈하는 컨텐츠 목록 보기
   *
   * @author jochongs
   */
  public async getSoonOpenContentAll(
    userIdx?: number,
  ): Promise<SummaryContentEntity[]> {
    const contentList =
      await this.cultureContentRepository.selectSoonOpenCultureContentAll(
        userIdx,
      );

    return contentList.map((content) =>
      SummaryContentEntity.createEntity(content),
    );
  }

  /**
   * 곧 종료하는 컨텐츠 목록 보기
   *
   * @author jochongs
   */
  public async getSoonEndContentAll(
    userIdx?: number,
  ): Promise<SummaryContentEntity[]> {
    const contentList =
      await this.cultureContentRepository.selectSoonEndCultureContentAll(
        userIdx,
      );

    return contentList.map((content) =>
      SummaryContentEntity.createEntity(content),
    );
  }

  /**
   * 인기 컨텐츠 전부 보기
   *
   * @author jochongs
   */
  public async getHotContentAll() {
    const genreList =
      await this.cultureContentRepository.selectHotCultureContentAll();

    return genreList.map((genre) =>
      GenreWithHotContentEntity.createEntity(genre),
    );
  }

  /**
   * 인기 연령대 컨텐츠 목록 보기
   *
   * @author jochongs
   */
  public async getHotContentByAge(
    loginUser?: LoginUser,
  ): Promise<{ contentList: SummaryContentEntity[]; age: TagEntity }> {
    const ageIdx = await this.getLoginUserAgeIdx(loginUser);

    const age = await this.contentTagRepository.selectAgeByIdx(ageIdx);

    const contentList =
      await this.cultureContentRepository.selectHotCultureContentByAgeIdx(
        ageIdx,
        loginUser?.idx,
      );

    return {
      contentList: contentList.map((content) =>
        SummaryContentEntity.createEntity(content),
      ),
      age: TagEntity.createEntity(age),
    };
  }

  /**
   * @author jochongs
   */
  private async getLoginUserAgeIdx(loginUser?: LoginUser) {
    if (!loginUser) {
      return 1; // 20대
    }

    const user = await this.userRepository.selectUserByIdx(loginUser.idx);

    if (!user?.birth) {
      return 4; // 20대
    }

    const date = new Date();

    const userAge = date.getFullYear() - user.birth;

    if (userAge < 10) {
      return 2; // 아이들
    }

    if (userAge < 20) {
      return 3;
    }

    if (userAge < 30) {
      return 4;
    }

    if (userAge < 40) {
      return 5;
    }

    return 6;
  }

  /**
   * 인기 스타일 컨텐츠 목록보기
   *
   * @author jochongs
   */
  public async getHotContentByStyle(
    loginUser?: LoginUser,
  ): Promise<{ contentList: SummaryContentEntity[]; style: TagEntity }> {
    const hotStyle = await this.contentTagRepository.selectHotStyle();

    const contentList =
      await this.cultureContentRepository.selectHotCultureContentByStyleIdx(
        hotStyle.idx,
        loginUser?.idx,
      );

    return {
      contentList: contentList.map((content) =>
        SummaryContentEntity.createEntity(content),
      ),
      style: {
        idx: hotStyle.idx,
        name: hotStyle.name,
      },
    };
  }

  /**
   * 인기 스타일 컨텐츠 목록보기 (랜덤)
   *
   * @author jochongs
   */
  public async getHotContentByRandomStyle(
    loginUser?: LoginUser,
  ): Promise<{ contentList: SummaryContentEntity[]; style: TagEntity }> {
    const hotStyles =
      await this.contentTagRepository.selectStylesWithContentCount();

    if (hotStyles[0].count <= 5) {
      const hotStyle = hotStyles[0];

      const contentList =
        await this.cultureContentRepository.selectHotCultureContentByStyleIdx(
          hotStyle.idx,
          loginUser?.idx,
        );

      return {
        contentList: contentList.map((content) =>
          SummaryContentEntity.createEntity(content),
        ),
        style: {
          idx: hotStyle.idx,
          name: hotStyle.name,
        },
      };
    }

    const styles = hotStyles.filter((style) => style.count >= 5);

    const randomStyle = styles[Math.floor(Math.random() * styles.length)];

    const contentList =
      await this.cultureContentRepository.selectHotCultureContentByStyleIdx(
        randomStyle.idx,
        loginUser?.idx,
      );

    return {
      contentList: contentList.map((content) =>
        SummaryContentEntity.createEntity(content),
      ),
      style: {
        idx: randomStyle.idx,
        name: randomStyle.name,
      },
    };
  }

  /**
   * 문화생활컨텐츠 생성하기
   *
   * @author jochongs
   */
  public async createContentRequest(
    userIdx: number,
    createDto: CreateContentRequestDto,
  ): Promise<number> {
    return this.cultureContentRepository.insertCultureContent(
      userIdx,
      createDto,
    );
  }

  /**
   * @author jochongs
   */
  public async updateContentRequest(
    idx: number,
    updateDto: UpdateContentDto,
    userIdx: number,
  ): Promise<void> {
    await this.cultureContentRepository.updateCultureContentByIdx(
      idx,
      updateDto,
    );

    return;
  }

  /**
   * @author jochongs
   */
  public async deleteContentRequest(idx: number): Promise<void> {
    await this.cultureContentRepository.deleteContentRequest(idx);
  }

  /**
   * @author jochongs
   */
  public async likeContent(userIdx: number, contentIdx: number) {
    const likeState =
      await this.cultureContentLikeRepository.selectCultureContentLike(
        userIdx,
        contentIdx,
      );

    if (likeState) {
      this.logger.warn(
        this.likeContent,
        'Attempt to like to already liked content',
      );
      throw new AlreadyLikeContentException('Already liked culture content');
    }

    await this.cultureContentLikeRepository.increaseCultureContentLike(
      userIdx,
      contentIdx,
    );

    return;
  }

  /**
   * @author jochongs
   */
  public async cancelToLikeContent(
    userIdx: number,
    contentIdx: number,
  ): Promise<void> {
    await this.getContentByIdx(contentIdx);

    const likeState =
      await this.cultureContentLikeRepository.selectCultureContentLike(
        userIdx,
        contentIdx,
      );

    if (!likeState) {
      this.logger.warn(
        this.likeContent,
        'Attempt to cancel to like non-liked content',
      );
      throw new AlreadyNotLikeContentException(
        'Already do not like culture content',
      );
    }

    await this.cultureContentLikeRepository.decreaseCultureContentLike(
      userIdx,
      contentIdx,
    );

    return;
  }

  /**
   * 좋아요 누른 컨텐츠 목록 보기
   *
   * @author jochongs
   */
  public async getLikeContentAll(
    loginUser: LoginUser,
    pagerble: LikeContentPagerbleDto,
  ): Promise<SummaryContentEntity[]> {
    const likeContentList =
      await this.cultureContentLikeRepository.selectLikeContentAll(
        loginUser.idx,
        pagerble,
      );
    return likeContentList.map((likeContent) =>
      SummaryContentEntity.fromLikeContent(likeContent),
    );
  }
}
