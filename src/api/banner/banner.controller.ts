import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerEntity } from './entity/BannerEntity';
import { CreateBannerDto } from './dto/CreateBannerDto';
import { UpdateBannerDto } from './dto/UpdateBannerDto';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  /**
   * Create banner API
   * @summary Create banner API
   *
   * @tag Banner
   */
  @Post('/')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid querystring')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'No admin authorization')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async createBanner(
    @User() loginUser: LoginUserDto,
    @Body() createDto: CreateBannerDto,
  ): Promise<number> {
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    return await this.bannerService.createBanner(createDto);
  }

  /**
   * Update banner API
   * @summary Update banner API
   *
   * @tag Banner
   */
  @Put('/:idx')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid body')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'No admin authorization')
  @TypedException<ExceptionDto>(404, 'Cannot find banner')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async updateBanner(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) idx: number,
    @Body() updateDto: UpdateBannerDto,
  ): Promise<void> {
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    await this.bannerService.updateBanner(idx, updateDto);

    return;
  }

  /**
   * Delete banner API
   * @summary Delete banner API
   *
   * @tag Banner
   */
  @Delete('/:idx')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'No admin authorization')
  @TypedException<ExceptionDto>(404, 'Cannot find banner')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async deleteBanner(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<void> {
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    await this.bannerService.deleteBanner(idx);

    return;
  }

  // User =====================================================

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
