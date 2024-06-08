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
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { GetCultureContentAllResponseDto } from './dto/response/get-content-all.response.dto';
import { ContentPagerbleDto } from './dto/content-pagerble.dto';
import { GetSoonOpenCultureContentResponseDto } from './dto/response/get-soon-open-content-response.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentEntity } from './entity/content.entity';
import { LoginAuth } from '../auth/login-auth.decorator';
import { Exception } from '../../common/decorator/exception.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ContentAuthService } from './content-auth.service';

@Controller('culture-content')
@ApiTags('Culture-Content')
export class CultureContentController {
  constructor(
    private readonly cultureContentService: CultureContentService,
    private readonly contentAuthService: ContentAuthService,
  ) {}

  /**
   * 문화생활컨텐츠 목록 보기
   */
  @Get('/all')
  @HttpCode(200)
  @Exception(400, 'Invalid querystring')
  @LoginAuth()
  public async getCultureContentAll(
    @User() loginUser: LoginUserDto,
    @Query() pagerble: ContentPagerbleDto,
  ): Promise<GetCultureContentAllResponseDto> {
    await this.contentAuthService.checkReadAllPermission(loginUser, pagerble);

    const result = await this.cultureContentService.getContentAll(
      pagerble,
      loginUser.idx,
    );

    return result;
  }

  /**
   * 오픈 예정 컨텐츠 목록 보기
   */
  @Get('/soon-open/all')
  @HttpCode(200)
  @LoginAuth()
  public async getSoonOpenCultureContentAll(
    @User() loginUser: LoginUserDto,
  ): Promise<GetSoonOpenCultureContentResponseDto> {
    const contentList = await this.cultureContentService.getSoonOpenContentAll(
      loginUser.idx,
    );

    return {
      contentList: contentList,
    };
  }

  /**
   * 종료 예정 컨텐츠 목록보기
   */
  @Get('/soon-end/all')
  @LoginAuth()
  public async getSoonEndCultureContentAll(
    @User() loginUser: LoginUserDto,
  ): Promise<GetSoonOpenCultureContentResponseDto> {
    const contentList = await this.cultureContentService.getSoonEndContentAll(
      loginUser.idx,
    );

    return {
      contentList,
    };
  }

  /**
   * 컨텐츠 자세히보기
   */
  @Get('/:idx')
  @HttpCode(200)
  @Exception(400, 'Invalid querystring')
  @Exception(404, 'Cannot find culture-content')
  @LoginAuth()
  public async getCultureContentByIdx(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<ContentEntity> {
    await this.contentAuthService.checkReadPermission(loginUser, contentIdx);

    const content = await this.cultureContentService.getContentByIdx(
      contentIdx,
      loginUser.idx,
    );

    return content;
  }

  /**
   * 컨텐츠 좋아요 하기
   */
  @Post('/:idx/like')
  @HttpCode(201)
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find culture-content')
  @Exception(409, 'Already like culture-content')
  @LoginAuth()
  public async likeCultureContent(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<void> {
    await this.cultureContentService.likeContent(loginUser.idx, contentIdx);

    return;
  }

  /**
   * 컨텐츠 좋아요 취소하기
   */
  @Delete('/:idx/like')
  @HttpCode(201)
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find culture-content')
  @Exception(409, 'Already like culture-content')
  @LoginAuth()
  public async cancelToLikeCutlureContent(
    @User() loginUser: LoginUserDto,
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
   */
  @Post('/request')
  @HttpCode(200)
  @Exception(400, 'Invalid body')
  @LoginAuth()
  public async createCultureContentRequest(
    @Body() createDto: CreateContentRequestDto,
    @User() loginUser: LoginUserDto,
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
   */
  @Put('/request/:idx')
  @HttpCode(201)
  @Exception(400, 'Invalid body')
  @Exception(404, 'Cannot find culture-content')
  @Exception(409, 'Accepted request')
  @LoginAuth()
  public async updateContentRequest(
    @User() loginUser: LoginUserDto,
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
   */
  @Delete('/request/:idx')
  @HttpCode(201)
  @Exception(400, 'Invalid body')
  @Exception(404, 'Cannot find culture-content')
  @Exception(409, 'Accepted request')
  @LoginAuth()
  public async deleteContentRequest(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<void> {
    await this.contentAuthService.checkDeletePermission(loginUser, contentIdx);

    await this.cultureContentService.deleteContentRequest(contentIdx);

    return;
  }
}
