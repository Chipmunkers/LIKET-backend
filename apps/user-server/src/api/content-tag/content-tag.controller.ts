import { Controller, Get, HttpCode } from '@nestjs/common';
import { ContentTagService } from './content-tag.service';
import { ApiTags } from '@nestjs/swagger';
import { GetTagAllResponseDto } from './dto/response/get-tag-all-response.dto';

@Controller('culture-content')
@ApiTags('Content-Tags')
export class ContentTagController {
  constructor(private readonly contentTagService: ContentTagService) {}

  /**
   * 스타일 목록 보기
   *
   * @author jochongs
   */
  @Get('/style/all')
  @HttpCode(200)
  public async getStyleAll(): Promise<GetTagAllResponseDto> {
    return await this.contentTagService.getStyleAll();
  }

  /**
   * 연령대 목록 보기
   *
   * @author jochongs
   */
  @Get('/age/all')
  @HttpCode(200)
  public async getAgeAll(): Promise<GetTagAllResponseDto> {
    return await this.contentTagService.getAgeAll();
  }

  /**
   * 장르 목록 보기
   *
   * @author jochongs
   */
  @Get('/genre/all')
  @HttpCode(200)
  public async getGenreAll(): Promise<GetTagAllResponseDto> {
    return await this.contentTagService.getGenreAll();
  }
}
