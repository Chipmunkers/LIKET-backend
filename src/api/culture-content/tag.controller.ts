import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { GetTagAllDto } from './dto/response/GetTagAllDto';

@Controller('culture-content')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * Get style all API
   * @summary Get style all API
   *
   * @tag Tag
   */
  @Get('/style/all')
  @TypedException<ExceptionDto>(500, 'Server Error')
  public async getStyleAll(): Promise<GetTagAllDto> {
    return await this.tagService.getStyleAll();
  }

  /**
   * Get age all API
   * @summary Get age all API
   *
   * @tag Tag
   */
  @Get('/age/all')
  @TypedException<ExceptionDto>(500, 'Server Error')
  public async getAgeAll(): Promise<GetTagAllDto> {
    return await this.tagService.getAgeAll();
  }

  /**
   * Get genre all API
   * @summary Get genre all API
   *
   * @tag Tag
   */
  @Get('/genre/all')
  @TypedException<ExceptionDto>(500, 'Server Error')
  public async getGenreAll(): Promise<GetTagAllDto> {
    return await this.tagService.getGenreAll();
  }
}
