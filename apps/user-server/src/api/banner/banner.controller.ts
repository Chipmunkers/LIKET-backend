import { Controller, Get, HttpCode } from '@nestjs/common';
import { BannerService } from './banner.service';
import { ApiTags } from '@nestjs/swagger';
import { GetBannerAllResponseDto } from './dto/response/get-banner-all-response.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  /**
   * 배너 목록 보기
   *
   * @author jochongs
   */
  @Get('/all')
  @ApiTags('Banner')
  @HttpCode(200)
  public async getActiveBannerAll(): Promise<GetBannerAllResponseDto> {
    const bannerList = await this.bannerService.getBannerAll();

    return {
      bannerList,
    };
  }
}
