import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CultureContentService } from './culture-content.service';
import { CreateContentRequestResponseDto } from './dto/response/create-content-request-response.dto';
import { CreateContentRequestDto } from './dto/create-content-request.dto';
import { User } from '../user/user.decorator';
import { GetCultureContentAllResponseDto } from './dto/response/get-content-all.response.dto';
import { ContentPagerbleDto } from './dto/content-pagerble.dto';
import { GetSoonOpenCultureContentResponseDto } from './dto/response/get-soon-open-content-response.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentEntity } from './entity/content.entity';
import { LoginAuth } from '../auth/login-auth.decorator';
import { Exception } from '../../common/decorator/exception.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ContentAuthService } from './content-auth.service';
import { LoginUser } from '../auth/model/login-user';
import { GetHotContentResponseDto } from './dto/response/get-hot-style-content.dto';
import { GetHotAgeContentResponseDto } from './dto/response/get-hot-age-content.dto';
import { LikeContentPagerbleDto } from './dto/like-content-pagerble.dto';
import { GetLikeContentAllResponseDto } from './dto/response/get-like-content-all.dto';
import { ContentViewService } from './content-view.service';
import { GenreWithHotContentEntity } from 'apps/user-server/src/api/culture-content/entity/genre-with-hot-content.entity';

@Controller('culture-content')
@ApiTags('Culture-Content')
export class CultureContentController {
  constructor(
    private readonly cultureContentService: CultureContentService,
    private readonly contentAuthService: ContentAuthService,
    private readonly contentViewService: ContentViewService,
  ) {}

  /**
   * 문화생활컨텐츠 목록 보기
   *
   * @author jochongs
   */
  @Get('/all')
  @HttpCode(200)
  @Exception(400, 'Invalid querystring')
  @Exception(403, 'Permission denied')
  public async getCultureContentAll(
    @Query() pagerble: ContentPagerbleDto,
    @User() loginUser?: LoginUser,
  ): Promise<GetCultureContentAllResponseDto> {
    await this.contentAuthService.checkReadAllPermission(pagerble, loginUser);

    const result = await this.cultureContentService.getContentAll(
      pagerble,
      loginUser?.idx,
    );

    return result;
  }

  /**
   * 오픈 예정 컨텐츠 목록 보기
   *
   * @author jochongs
   */
  @Get('/soon-open/all')
  @HttpCode(200)
  public async getSoonOpenCultureContentAll(
    @User() loginUser?: LoginUser,
  ): Promise<GetSoonOpenCultureContentResponseDto> {
    const contentList = await this.cultureContentService.getSoonOpenContentAll(
      loginUser?.idx,
    );

    return {
      contentList: contentList,
    };
  }

  /**
   * 종료 예정 컨텐츠 목록보기
   *
   * @author jochongs
   */
  @Get('/soon-end/all')
  public async getSoonEndCultureContentAll(
    @User() loginUser?: LoginUser,
  ): Promise<GetSoonOpenCultureContentResponseDto> {
    const contentList = await this.cultureContentService.getSoonEndContentAll(
      loginUser?.idx,
    );

    return {
      contentList,
    };
  }

  /**
   * 핫플 차트 보기
   *
   * @author jochongs
   */
  @Get('/hot/all')
  public async getHotCultureContentAll(): Promise<GenreWithHotContentEntity[]> {
    return await this.cultureContentService.getHotContentAll();
  }

  /**
   * 연령대의 인기 컨텐츠 보기
   *
   * @author jochongs
   */
  @Get('/hot-age/all')
  public async getHotAgeCultureContentAll(
    @User() loginUser?: LoginUser,
  ): Promise<GetHotAgeContentResponseDto> {
    return await this.cultureContentService.getHotContentByAge(loginUser);
  }

  /**
   * 인기 스타일 컨텐츠 목록보기
   *
   * @author jochongs
   */
  @Get('/hot-style/all')
  public async getHotStyleCultureContentAll(
    @User() loginUser?: LoginUser,
  ): Promise<GetHotContentResponseDto> {
    return await this.cultureContentService.getHotContentByStyle(loginUser);
  }

  /**
   * 인기 스타일 컨텐츠 목록보기 (랜덤)
   *
   * @author jochongs
   */
  @Get('/hot-random-style/all')
  public async getHotRandomStyleCultureContentAll(
    @User() loginUser?: LoginUser,
  ): Promise<GetHotContentResponseDto> {
    return await this.cultureContentService.getHotContentByRandomStyle(
      loginUser,
    );
  }

  /**
   * 컨텐츠 자세히보기
   *
   * @author jochongs
   */
  @Get('/:idx')
  @HttpCode(200)
  @Exception(400, 'Invalid querystring')
  @Exception(404, 'Cannot find culture-content')
  public async getCultureContentByIdx(
    @Param('idx', ParseIntPipe) contentIdx: number,
    @User() loginUser?: LoginUser,
  ): Promise<ContentEntity> {
    await this.contentAuthService.checkReadPermission(contentIdx, loginUser);

    const content = await this.cultureContentService.getContentByIdx(
      contentIdx,
      loginUser,
    );

    if (loginUser) {
      this.contentViewService.increaseViewCount(loginUser.idx, contentIdx);
    }

    return content;
  }

  /**
   * 컨텐츠 좋아요 하기
   *
   * @author jochongs
   */
  @Post('/:idx/like')
  @HttpCode(201)
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find culture-content')
  @Exception(409, 'Already like culture-content')
  @LoginAuth()
  public async likeCultureContent(
    @User() loginUser: LoginUser,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<void> {
    await this.cultureContentService.likeContent(loginUser.idx, contentIdx);

    return;
  }

  /**
   * 컨텐츠 좋아요 취소하기
   *
   * @author jochongs
   */
  @Delete('/:idx/like')
  @HttpCode(201)
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find culture-content')
  @Exception(409, 'Already like culture-content')
  @LoginAuth()
  public async cancelToLikeCultureContent(
    @User() loginUser: LoginUser,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<void> {
    await this.cultureContentService.cancelToLikeContent(
      loginUser.idx,
      contentIdx,
    );

    return;
  }

  /**
   * 컨텐츠 요청하기
   *
   * @author jochongs
   */
  @Post('/request')
  @HttpCode(200)
  @Exception(400, 'Invalid body')
  @LoginAuth()
  public async createCultureContentRequest(
    @Body() createDto: CreateContentRequestDto,
    @User() loginUser: LoginUser,
  ): Promise<CreateContentRequestResponseDto> {
    const contentIdx = await this.cultureContentService.createContentRequest(
      loginUser.idx,
      createDto,
    );

    return {
      idx: contentIdx,
    };
  }

  /**
   * 컨텐츠 수정하기 (수락하지 않은 컨텐츠만 수정 가능)
   *
   * @author jochongs
   */
  @Put('/request/:idx')
  @HttpCode(201)
  @Exception(400, 'Invalid body')
  @Exception(404, 'Cannot find culture-content')
  @Exception(409, 'Accepted request')
  @LoginAuth()
  public async updateContentRequest(
    @User() loginUser: LoginUser,
    @Param('idx', ParseIntPipe) contentIdx: number,
    @Body() updateDto: UpdateContentDto,
  ): Promise<void> {
    await this.contentAuthService.checkUpdatePermission(
      loginUser,
      contentIdx,
      updateDto,
    );

    await this.cultureContentService.updateContentRequest(
      contentIdx,
      updateDto,
      loginUser.idx,
    );

    return;
  }

  /**
   * 컨텐츠 삭제하기 (수락하지 않은 컨텐츠만 수정 가능)
   *
   * @author jochongs
   */
  @Delete('/request/:idx')
  @HttpCode(201)
  @Exception(400, 'Invalid body')
  @Exception(404, 'Cannot find culture-content')
  @Exception(409, 'Accepted request')
  @LoginAuth()
  public async deleteContentRequest(
    @User() loginUser: LoginUser,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<void> {
    await this.contentAuthService.checkDeletePermission(loginUser, contentIdx);

    await this.cultureContentService.deleteContentRequest(contentIdx);

    return;
  }

  /**
   * 좋아요 컨텐츠 목록 보기
   *
   * @author jochongs
   */
  @Get('/like/all')
  @Exception(400, 'Invalid querystring')
  @LoginAuth()
  public async getLikeContentAll(
    @Query() pagerble: LikeContentPagerbleDto,
    @User() loginUser: LoginUser,
  ): Promise<GetLikeContentAllResponseDto> {
    return {
      contentList: await this.cultureContentService.getLikeContentAll(
        loginUser,
        pagerble,
      ),
    };
  }
}
