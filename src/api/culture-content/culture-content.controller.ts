import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CultureContentService } from './culture-content.service';
import { CreateContentRequestResponseDto } from './dto/response/CreateContentRequestResponseDto';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { CreateContentRequestDto } from './dto/CreateContentRequestDto';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { ContentRequestListPagenationDto } from './dto/ContentRequestListPagenationDto';
import { GetCultureContentRequestAllResponseDto } from './dto/response/GetCultureContentRequestAllResponseDto';
import { ContentEntity } from './entity/ContentEntity';
import { GetCultureContentAllResponseDto } from './dto/response/GetCultureContentAllResponseDto';
import { ContentListPagenationDto } from './dto/ContentListPagenationDto';
import { GetSoonOpenCultureContentResponseDto } from './dto/response/GetSoonOpenCultureContentResponseDto';
import { UpdateContentDto } from './dto/UpdateContentDto';

@Controller('culture-content')
export class CultureContentController {
  constructor(private readonly cultureContentService: CultureContentService) {}

  // Culture Content

  /**
   * Get culture-content all API
   * @summary Get culture-content all API
   *
   * @tag Culture-Content
   */
  @Get('/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid querystring')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getCultureContentAll(
    @User() loginUser: LoginUserDto,
    @Query() pagerble: ContentListPagenationDto,
  ): Promise<GetCultureContentAllResponseDto> {
    const result = await this.cultureContentService.getContentAll(
      pagerble,
      loginUser.idx,
    );

    return result;
  }

  /**
   * Get soon open culture-content all API
   * @summary Get soon open cultur-content all API
   *
   * @tag Culture-Content
   */
  @Get('/soon-open/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
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
   * Get soon end culture-content all API
   * @summary Get soon end culture-content API
   *
   * @tag Culture-Content
   */
  @Get('/soon-end/all')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
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
   * Get culture-content by idx API
   * @summary Get culture-content by idx API
   *
   * @tag Culture-Content
   */
  @Get('/:idx')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid querystring')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(404, 'Cannot find culture-content')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getCultureContentByIdx(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<ContentEntity<'detail', 'user'>> {
    const content = await this.cultureContentService.getContentByIdx(
      contentIdx,
      loginUser.idx,
    );

    return content;
  }

  /**
   * Like culture-content API
   * @summary Like culture-content API
   *
   * @tag Culture-Content
   */
  @Post('/:idx/like')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(404, 'Cannot find culture-content')
  @TypedException<ExceptionDto>(409, 'Already like culture-content')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async likeCultureContent(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<void> {
    await this.cultureContentService.likeContent(loginUser.idx, contentIdx);

    return;
  }

  /**
   * Cancel to like culture-content API
   * @summary Cancel to like culture-content API
   *
   * @tag Culture-Content
   */
  @Delete('/:idx/like')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(404, 'Cannot find culture-content')
  @TypedException<ExceptionDto>(409, 'Already like culture-content')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
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

  // Culture Content Reqeust

  /**
   * Get cutlure-content request all API
   * @summary Get culture-content all API
   *
   * @tag Culture-Content-Request
   */
  @Get('/request/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid querystring')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'No admin authorization')
  @UseGuards(LoginAuthGuard)
  public async getCultureContentRequestAll(
    @Query() pagerble: ContentRequestListPagenationDto,
    @User() loginUser: LoginUserDto,
  ): Promise<GetCultureContentRequestAllResponseDto> {
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    const result = await this.cultureContentService.getContentRequestAll(
      pagerble,
    );

    return result;
  }

  /**
   * Get culture-content by idx API
   * @summary Get culture-content by idx API
   *
   * @tag Culture-Content-Request
   */
  @Get('/request/:idx')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'No admin authorization')
  @TypedException<ExceptionDto>(404, 'Cannot find culture-content')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getCultureContentRequestByIdx(
    @Param('idx', ParseIntPipe) contentIdx: number,
    @User() loginUser: LoginUserDto,
  ): Promise<ContentEntity<'detail', 'admin'>> {
    const content = await this.cultureContentService.getContentRequestByIdx(
      contentIdx,
    );

    if (loginUser.idx !== content.author.idx && !loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    return content;
  }

  /**
   * Create culture-content request API
   * @summary Create culture-content reqeust API
   *
   * @tag Culture-Content-Request
   */
  @Post('/request')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid body')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
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
   * Update culture-content request API
   * @summary Update culture-content request API
   *
   * @tag Culture-Content-Request
   */
  @Put('/request/:idx')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid body')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Accepted culture-content')
  @TypedException<ExceptionDto>(404, 'Cannot find culture-content')
  @TypedException<ExceptionDto>(409, 'Accepted request')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async updateContentRequest(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) contentIdx: number,
    @Body() updateDto: UpdateContentDto,
  ): Promise<void> {
    const content = await this.cultureContentService.getContentRequestByIdx(
      contentIdx,
    );

    if (content.acceptedAt) {
      throw new ConflictException('Cannot update accepted request');
    }

    if (content.author.idx !== loginUser.idx) {
      throw new ForbiddenException('Permission denied');
    }

    await this.cultureContentService.updateContentRequest(
      contentIdx,
      updateDto,
    );

    return;
  }

  /**
   * Delete culture-content request API
   * @summary Delete culture-content request API
   *
   * @tag Cutlure-Content-Request
   */
  @Delete('/request/:idx')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid body')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Accepted culture-content')
  @TypedException<ExceptionDto>(404, 'Cannot find culture-content')
  @TypedException<ExceptionDto>(409, 'Accepted request')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async deleteContentRequest(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<void> {
    const content = await this.cultureContentService.getContentRequestByIdx(
      contentIdx,
    );

    if (content.acceptedAt) {
      throw new ConflictException('Cannot update accepted request');
    }

    if (content.author.idx !== loginUser.idx || !loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    await this.cultureContentService.deleteContentRequest(contentIdx);

    return;
  }

  /**
   * Accept culture-content API
   * @summary Accept culture-content API
   *
   * @tag Culture-Content-Request
   */
  @Post('/request/:idx/accept')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid body')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'No admin authorization')
  @TypedException<ExceptionDto>(404, 'Cannot find culture-content')
  @TypedException<ExceptionDto>(409, 'Already active cutlure-content')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async acceptCultureContentRequest(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<void> {
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    await this.cultureContentService.acceptContentRequest(contentIdx);

    return;
  }

  /**
   * Deactivate cutlure-content API
   * @summary Deactivate culture-content API
   *
   * @tag Culture-Content-Request
   */
  @Post('/request/:idx/deactivate')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid body')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'No admin authorization')
  @TypedException<ExceptionDto>(404, 'Cannot find culture-content')
  @TypedException<ExceptionDto>(409, 'Already deactive cutlure-content')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async deactivateCultureContentRequest(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) contentIdx: number,
  ): Promise<void> {
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    await this.cultureContentService.deactivateContent(contentIdx);

    return;
  }
}
