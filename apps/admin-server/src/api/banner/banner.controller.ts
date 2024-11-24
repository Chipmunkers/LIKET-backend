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
import { BannerService } from './banner.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAuth } from '../auth/login-auth.decorator';
import { CreateBannerDto } from './dto/request/create-banner.dto';
import { CreateBannerResponseDto } from './dto/response/create-banner-response.dto';
import { UpadteBannerDto } from './dto/request/update-banner.dto';
import { UpdateBannerOrderDto } from './dto/request/update-banner-order.dto';
import { GetBannerAllResponseDto } from './dto/response/get-banner-all-response.dto';
import { GetBannerAllPagerbleDto } from './dto/request/get-banner-all-pagerble.dto';
import { GetBannerResponseDto } from './dto/response/get-banner-response.dto';
import { GetActiveBannerAllResponseDto } from './dto/response/get-active-banner-all-response.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  /**
   * 배너 목록 보기
   */
  @Get('/all')
  @HttpCode(200)
  @ApiTags('Banner')
  @ApiResponse({ status: 400, description: 'Invalid querystring' })
  @LoginAuth()
  async getBannerAll(@Query() pagerble: GetBannerAllPagerbleDto): Promise<GetBannerAllResponseDto> {
    return await this.bannerService.getBannerAll(pagerble);
  }

  /**
   * 배너 자세히보기
   */
  @Get('/:idx')
  @HttpCode(200)
  @ApiTags('Banner')
  @ApiResponse({ status: 404, description: 'Cannot find banner' })
  @LoginAuth()
  async getBannerByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<GetBannerResponseDto> {
    const banner = await this.bannerService.getBannerByIdx(idx);

    return { banner };
  }

  /**
   * 활성 배너 목록 보기
   */
  @Get('/active/all')
  @HttpCode(200)
  @ApiTags('Banner')
  @LoginAuth()
  async getActiveBannerAll(): Promise<GetActiveBannerAllResponseDto> {
    return await this.bannerService.getActiveBannerAll();
  }

  /**
   * 배너 생성하기
   */
  @Post('/')
  @HttpCode(200)
  @ApiTags('Banner')
  @ApiResponse({ status: 404, description: 'Cannot find banner image' })
  @LoginAuth()
  async createBanner(@Body() createDto: CreateBannerDto): Promise<CreateBannerResponseDto> {
    const idx = await this.bannerService.createBanner(createDto);

    return { idx };
  }

  /**
   * 배너 수정하기
   */
  @Put('/:idx')
  @HttpCode(201)
  @ApiTags('Banner')
  @ApiResponse({ status: 404, description: 'Cannot find banner image' })
  @LoginAuth()
  async updateBanner(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() udpateDto: UpadteBannerDto,
  ): Promise<void> {
    await this.bannerService.updateBanner(idx, udpateDto);

    return;
  }

  /**
   * 배너 삭제하기
   */
  @Delete('/:idx')
  @HttpCode(201)
  @ApiTags('Banner')
  @ApiResponse({ status: 404, description: 'Cannot find banner' })
  @LoginAuth()
  async deleteBanner(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    await this.bannerService.getBannerByIdx(idx);

    await this.bannerService.deleteBanner(idx);

    return;
  }

  /**
   * 배너 활성화하기
   */
  @Post('/:idx/activate')
  @HttpCode(201)
  @ApiTags('Banner')
  @ApiResponse({ status: 404, description: 'Cannot find banner' })
  @ApiResponse({ status: 409, description: 'Already activate banner' })
  @LoginAuth()
  async activateBanner(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    await this.bannerService.getBannerByIdx(idx);

    await this.bannerService.activateBanner(idx);

    return;
  }

  /**
   * 배너 비활성화하기
   */
  @Post('/:idx/deactivate')
  @HttpCode(201)
  @ApiTags('Banner')
  @ApiResponse({ status: 404, description: 'Cannot find banner' })
  @ApiResponse({ status: 409, description: 'Already deactivate banner' })
  @LoginAuth()
  async deactivateBanner(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    await this.bannerService.getBannerByIdx(idx);

    await this.bannerService.deactivateBanner(idx);

    return;
  }

  /**
   * 배너 순서 변경하기
   */
  @Put('/:idx/order')
  @HttpCode(201)
  @ApiTags('Banner')
  @ApiResponse({ status: 400, description: 'Invalid order' })
  @ApiResponse({ status: 404, description: 'Cannot find banner' })
  @ApiResponse({ status: 409, description: 'Deactivate banner' })
  @LoginAuth()
  async updateBannerOrder(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() updateDto: UpdateBannerOrderDto,
  ) {
    await this.bannerService.getBannerByIdx(idx);

    await this.bannerService.updateBannerOrder(idx, updateDto);

    return;
  }
}
