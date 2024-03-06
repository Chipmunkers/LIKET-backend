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
  Query,
  UseGuards,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryListPagenationDto } from './dto/InquiryListPagenationDto';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';
import { GetInquiryAllResponseDto } from './dto/response/GetInquiryAllResponseDto';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { InquiryEntity } from './entity/InquiryEntity';
import { CreateInquiryResponseDto } from './dto/response/CreateInquiryResponseDto';
import { CreateInquiryDto } from './dto/CreateInquiryDto';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  /**
   * Get inquiry all API for admin
   * @summary Get inquiry all API for admin
   *
   * @tag Inquiry
   */
  @Get('/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid querystring')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'No admin authorization')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getInquiryAll(
    @Query() pagerble: InquiryListPagenationDto,
    @User() loginUser: LoginUserDto,
  ): Promise<GetInquiryAllResponseDto> {
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('No admin authorization');
    }

    return await this.inquiryService.getInquiryAll(pagerble);
  }

  /**
   * Get inquiry by idx API
   * @summary Get inquiry by idx API
   *
   * @tag Inquiry
   */
  @Get('/:idx')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'No authorization')
  @TypedException<ExceptionDto>(404, 'Cannot find inquiry')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getInquiryByIdx(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<InquiryEntity<'detail'>> {
    if (loginUser.isAdmin) {
      return await this.inquiryService.getInquiryByIdx(idx);
    }

    const inquiry = await this.inquiryService.getInquiryByIdx(idx);

    if (loginUser.idx !== inquiry.author.idx) {
      throw new ForbiddenException('Permission denied');
    }

    return inquiry;
  }

  /**
   * Create inquiry API
   * @summary Create inquiry APi
   *
   * @tag Inquiry
   */
  @Post('/')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid body')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async createInquiry(
    @User() loginUser: LoginUserDto,
    @Body() createDto: CreateInquiryDto,
  ): Promise<CreateInquiryResponseDto> {
    const idx = await this.inquiryService.createInquiry(
      loginUser.idx,
      createDto,
    );

    return {
      idx,
    };
  }

  /**
   * Delete inquiry API
   * @summary Delete inquiry API
   *
   * @tag Inquiry
   */
  @Delete('/:idx')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid body')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'No authorization')
  @TypedException<ExceptionDto>(404, 'Cannot find inquiry')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async updateInquiry(
    @Param('idx', ParseIntPipe) inquiryIdx: number,
    @User() loginUser: LoginUserDto,
  ): Promise<void> {
    const inquiry = await this.inquiryService.getInquiryByIdx(inquiryIdx);

    if (inquiry.author.idx !== loginUser.idx && !loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    await this.inquiryService.deleteInquiry(inquiryIdx);

    return;
  }

  /**
   *
   */
}
