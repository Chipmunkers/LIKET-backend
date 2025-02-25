import { Injectable } from '@nestjs/common';
import { CreateContentRequestDto } from './dto/create-content-request.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentPagerbleDto } from './dto/content-pagerble.dto';
import { ContentNotFoundException } from './exception/ContentNotFound';
import { ContentEntity } from './entity/content.entity';
import { SummaryContentEntity } from './entity/summary-content.entity';
import { LoginUser } from '../auth/model/login-user';
import { CultureContentRepository } from './culture-content.repository';
import { ContentTagRepository } from '../content-tag/content-tag.repository';
import { UserRepository } from '../user/user.repository';
import { TagEntity } from '../content-tag/entity/tag.entity';
import { LikeContentPagerbleDto } from './dto/like-content-pagerble.dto';
import { GenreWithHotContentEntity } from 'apps/user-server/src/api/culture-content/entity/genre-with-hot-content.entity';
import { CultureContentCoreService } from 'libs/core/culture-content/culture-content-core.service';
import { CultureContentLikeCoreService } from 'libs/core/culture-content/culture-content-like-core.service';
import { ContentAuthService } from 'apps/user-server/src/api/culture-content/content-auth.service';
import { Style } from 'libs/core/tag-root/style/constant/style';

@Injectable()
export class CultureContentService {
  constructor(
    private readonly cultureContentRepository: CultureContentRepository,
    private readonly contentTagRepository: ContentTagRepository,
    private readonly userRepository: UserRepository,
    private readonly cultureContentCoreService: CultureContentCoreService,
    private readonly cultureContentLikeCoreService: CultureContentLikeCoreService,
    private readonly cultureContentAuthService: ContentAuthService,
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
    const contentModel =
      await this.cultureContentCoreService.findCultureContentByIdx(
        idx,
        loginUser?.idx,
      );

    if (!contentModel) {
      throw new ContentNotFoundException('Cannot find culture content');
    }

    this.cultureContentAuthService.checkReadPermission(contentModel, loginUser);

    const reviewCount =
      await this.cultureContentCoreService.getCultureContentReviewCountByIdx(
        idx,
      );
    const totalStarCount =
      await this.cultureContentCoreService.getCultureContentStarCountByIdx(idx);

    return ContentEntity.fromModel(
      contentModel,
      reviewCount,
      totalStarCount / reviewCount,
    );
  }

  /**
   * 컨텐츠 목록 보기
   *
   * @author jochongs
   */
  public async getContentAll(pagerble: ContentPagerbleDto, userIdx?: number) {
    const contentList =
      await this.cultureContentCoreService.findCultureContentAll(
        {
          page: pagerble.page,
          row: 10,
          accept: pagerble.accept,
          author: pagerble.user,
          genreList: pagerble.genre ? [pagerble.genre] : undefined,
          styleList: pagerble.style,
          ageList: pagerble.age ? [pagerble.age] : undefined,
          open:
            pagerble.open === undefined
              ? undefined
              : pagerble.open
                ? ['continue']
                : ['end'],
          orderBy:
            pagerble.orderby === 'like'
              ? 'like'
              : pagerble.orderby === 'create'
                ? 'create'
                : 'accept',
          order: pagerble.order,
          searchByList: ['title'],
          searchKeyword: pagerble.search,
          sidoCode: pagerble.region,
        },
        userIdx,
      );

    return {
      contentList: contentList.map(SummaryContentEntity.fromModel),
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
    return (
      await this.cultureContentCoreService.findCultureContentAll(
        {
          page: 1,
          row: 5,
          orderBy: 'startDate',
          open: ['soon-open'],
          accept: true,
          order: 'asc',
        },
        userIdx,
      )
    ).map(SummaryContentEntity.fromModel);
  }

  /**
   * 곧 종료하는 컨텐츠 목록 보기
   *
   * @author jochongs
   */
  public async getSoonEndContentAll(
    userIdx?: number,
  ): Promise<SummaryContentEntity[]> {
    return (
      await this.cultureContentCoreService.findCultureContentAll(
        {
          page: 1,
          row: 100,
          accept: true,
          open: ['continue'],
          orderBy: 'endDate',
          order: 'asc',
        },
        userIdx,
      )
    ).map(SummaryContentEntity.fromModel);
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

    return {
      contentList: (
        await this.cultureContentCoreService.findCultureContentAll(
          {
            page: 1,
            row: 5,
            styleList: [hotStyle.idx as Style], // TODO: hotStyle 자체를 변경해야함.
            orderBy: 'like',
            order: 'desc',
          },
          loginUser?.idx,
        )
      ).map(SummaryContentEntity.fromModel),
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
    const content = await this.cultureContentCoreService.createCultureContent({
      authorIdx: userIdx,
      imgList: createDto.imgList,
      ageIdx: createDto.ageIdx,
      genreIdx: createDto.genreIdx,
      isFee: createDto.isFee,
      isReservation: createDto.isReservation,
      isParking: createDto.isParking,
      isPet: createDto.isPet,
      location: createDto.location,
      title: createDto.title,
      openTime: createDto.openTime,
      websiteLink: createDto.websiteLink,
      id: null,
      description: createDto.description,
      endDate: createDto.endDate ? new Date(createDto.endDate) : null,
      startDate: new Date(createDto.startDate),
      styleIdxList: createDto.styleIdxList,
    });

    return content.idx;
  }

  /**
   * @author jochongs
   */
  public async updateContentRequest(
    idx: number,
    updateDto: UpdateContentDto,
    loginUser: LoginUser,
  ): Promise<void> {
    const contentModel =
      await this.cultureContentCoreService.findCultureContentByIdx(idx);

    if (!contentModel) {
      throw new ContentNotFoundException('Cannot find culture content');
    }

    this.cultureContentAuthService.checkUpdatePermission(
      loginUser,
      contentModel,
      updateDto,
    );

    await this.cultureContentCoreService.updateCultureContentByIdx(idx, {
      imgList: updateDto.imgList,
      ageIdx: updateDto.ageIdx,
      genreIdx: updateDto.genreIdx,
      isFee: updateDto.isFee,
      isReservation: updateDto.isReservation,
      isParking: updateDto.isParking,
      isPet: updateDto.isPet,
      location: updateDto.location,
      title: updateDto.title,
      openTime: updateDto.openTime,
      websiteLink: updateDto.websiteLink,
      description: updateDto.description,
      endDate: updateDto.endDate ? new Date(updateDto.endDate) : null,
      startDate: new Date(updateDto.startDate),
      styleIdxList: updateDto.styleIdxList,
    });

    return;
  }

  /**
   * @author jochongs
   */
  public async deleteContentRequest(
    idx: number,
    loginUser: LoginUser,
  ): Promise<void> {
    const contentModel =
      await this.cultureContentCoreService.findCultureContentByIdx(idx);

    if (!contentModel) {
      throw new ContentNotFoundException('Cannot find culture content');
    }

    this.cultureContentAuthService.checkDeletePermission(
      loginUser,
      contentModel,
    );

    await this.cultureContentRepository.deleteContentRequest(idx);
  }

  /**
   * @author jochongs
   */
  public async likeContent(userIdx: number, contentIdx: number): Promise<void> {
    await this.cultureContentLikeCoreService.likeCultureContentByIdx(
      userIdx,
      contentIdx,
    );
  }

  /**
   * @author jochongs
   */
  public async cancelToLikeContent(
    userIdx: number,
    contentIdx: number,
  ): Promise<void> {
    await this.cultureContentLikeCoreService.cancelToLikeCultureContentByIdx(
      userIdx,
      contentIdx,
    );
  }

  /**
   * 좋아요 누른 컨텐츠 목록 보기
   *
   * @author jochongs
   */
  public async getLikeContentAll(
    loginUser: LoginUser,
    pageable: LikeContentPagerbleDto,
  ): Promise<SummaryContentEntity[]> {
    return (
      await this.cultureContentCoreService.findLikedCultureContentAll(
        loginUser.idx,
        {
          page: pageable.page,
          row: 10,
          genre: pageable.genre ? [pageable.genre] : undefined,
          orderBy: 'like',
          order: 'desc',
          accept: true,
          open: pageable.onlyopen ? ['continue'] : [],
        },
      )
    ).map(SummaryContentEntity.fromModel);
  }
}

// TODO: delete, update 메서드들 auth 로직 제거하고 service 내부에서 삭제할 수 있는 체크하기
// TODO: updateCultureContentMethod, accept, revoke 메서드 관련 리팩토링 진행하고 테스트 케이스 만들기
// TODO: increaseCultureContentLikeByIdx 이거 마저 구현해야함 -> 좋아요 누른 사용자가 이미 눌렀을 때 예외처리같은게 하나도 없긴함.
// TODO: 좋아요 목록 보기 구현하다가 말았음. genre dto 손봤고 다음으로 genre 필터링 input에도 넣어야함
