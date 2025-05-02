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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAuth } from '../auth/login-auth.decorator';
import { GetContentPagerbleDto } from './dto/request/get-content-all-pagerble.dto';
import { GetContentAllResponseDto } from './dto/response/get-content-all-response.dto';
import { GetContentResponseDto } from './dto/response/get-content-response.dto';
import { LoginUser } from '../auth/login-user.decorator';
import { LoginPayloadDto } from '../../common/token/dto/loign-payload.dto';
import { CreateCultureContentDto } from './dto/request/create-culture-content.dto';
import { UpdateCultureContentDto } from './dto/request/update-culture-content.dto';
import { UpdatePermissionDeniedException } from './exception/UpdatePermissionDeniedException';
import { ContentFromInstagramEntity } from 'apps/admin-server/src/api/culture-content/entity/content-from-instagram.entity';

@Controller('culture-content')
export class CultureContentController {
  constructor(private readonly cultureContentService: CultureContentService) {}

  /**
   * 인스타 피드 게시글을 통해 문화생활컨텐츠 긁어오기
   */
  @Get('/instagram/:code')
  @HttpCode(200)
  @ApiTags('Culture-Content')
  @ApiResponse({ status: 400, description: 'Invalid ' })
  @LoginAuth()
  async getCultureContentInfoFromInstagram(
    @Param('code') code: string,
  ): Promise<ContentFromInstagramEntity> {
    return await this.cultureContentService.getCultureContentInfoFromInstagram(
      code,
    );
  }

  /**
   * 문화생활컨텐츠 목록 보기
   */
  @Get('/all')
  @HttpCode(200)
  @ApiTags('Culture-Content')
  @ApiResponse({ status: 400, description: 'Invalid querystring' })
  @LoginAuth()
  async getCultureContentAll(
    @Query() pagerble: GetContentPagerbleDto,
  ): Promise<GetContentAllResponseDto> {
    return await this.cultureContentService.getContentAll(pagerble);
  }

  /**
   * 문화생활컨텐츠 자세히보기
   */
  @Get('/:idx')
  @HttpCode(200)
  @ApiTags('Culture-Content')
  @ApiResponse({ status: 400, description: 'Invalid querystring' })
  @ApiResponse({ status: 404, description: 'Cannot find culture-content' })
  @LoginAuth()
  async getCultureContentByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<GetContentResponseDto> {
    const content = await this.cultureContentService.getContentByIdx(idx);

    return { content };
  }

  /**
   * 문화생활컨텐츠 생성하기
   */
  @Post('/')
  @HttpCode(201)
  @ApiTags('Culture-Content')
  @ApiResponse({ status: 400, description: 'Invalid body' })
  @LoginAuth()
  async createContent(
    @LoginUser() loginUser: LoginPayloadDto,
    @Body() createDto: CreateCultureContentDto,
  ): Promise<void> {
    await this.cultureContentService.createContent(loginUser.idx, createDto);

    return;
  }

  /**
   * 문화생활컨텐츠 수정하기
   */
  @Put('/:idx')
  @HttpCode(201)
  @ApiTags('Culture-Content')
  @ApiResponse({ status: 400, description: 'Invalid body' })
  @ApiResponse({ status: 404, description: 'Cannot find culture content' })
  @LoginAuth()
  async updateContentByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @LoginUser() loginUser: LoginPayloadDto,
    @Body() updateDto: UpdateCultureContentDto,
  ): Promise<void> {
    const content = await this.cultureContentService.getContentByIdx(idx);

    await this.cultureContentService.updateContentByIdx(idx, updateDto);

    return;
  }

  /**
   * 문화생활컨텐츠 삭제하기
   */
  @Delete('/:idx')
  @HttpCode(201)
  @ApiTags('Culture-content')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find culture content' })
  @LoginAuth()
  async deleteCultureContent(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.cultureContentService.deleteContentByIdx(idx);
  }

  /**
   * 문화생활컨텐츠 활성화하기
   */
  @Post('/:idx/activate')
  @HttpCode(201)
  @ApiTags('Culture-Content')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find culture content' })
  @ApiResponse({ status: 409, description: 'Already active culture content' })
  @LoginAuth()
  async activateContentByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.cultureContentService.activateContentByIdx(idx);

    return;
  }

  /**
   * 문화생활컨텐츠 비활성화하기
   */
  @Post('/:idx/deactivate')
  @HttpCode(201)
  @ApiTags('Culture-Content')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find culture content' })
  @ApiResponse({ status: 409, description: 'Already active culture content' })
  @LoginAuth()
  async deactivateContentByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    await this.cultureContentService.deactivateContentByIdx(idx);

    return;
  }
}
