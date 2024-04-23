import { Controller, Get, HttpCode } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerEntity } from './entity/BannerEntity';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  /**
   * Get all active banner all API
   * @summary Get all active banner all API
   *
   * @tag Banner
   */
  @Get('/active/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(500, 'Server Error')
  public async getActiveBannerAll(): Promise<BannerEntity<'active'>[]> {
    return await this.bannerService.getBannerAll();
  }
}
