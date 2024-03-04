import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
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
}
