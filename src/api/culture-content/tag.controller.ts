import { Controller, Get, HttpCode } from '@nestjs/common';
import { TagService } from './tag.service';
import { GetTagAllDto } from './dto/response/get-tag-all.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('culture-content')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * 스타일 목록 보기
   */
  @Get('/style/all')
  @HttpCode(200)
  @ApiTags('Tag')
  public async getStyleAll(): Promise<GetTagAllDto> {
    return await this.tagService.getStyleAll();
  }

  /**
   * 연령대 목록 보기
   */
  @Get('/age/all')
  @HttpCode(200)
  @ApiTags('Tag')
  public async getAgeAll(): Promise<GetTagAllDto> {
    return await this.tagService.getAgeAll();
  }

  /**
   * 장르 목록 보기
   */
  @Get('/genre/all')
  @HttpCode(200)
  @ApiTags('Tag')
  public async getGenreAll(): Promise<GetTagAllDto> {
    return await this.tagService.getGenreAll();
  }
}
