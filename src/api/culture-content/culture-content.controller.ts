import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
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

@Controller('culture-content')
export class CultureContentController {
  constructor(private readonly cultureContentService: CultureContentService) {}

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
}
