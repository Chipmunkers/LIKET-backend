import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { InquiryTypeService } from './inquiry-type.service';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { GetInquiryTypeAllResponseDto } from './dto/response/GetInquiryTypeAllResponseDto';

@Controller('/inquiry/type')
export class InquiryTypeController {
  constructor(private readonly inquiryTypeService: InquiryTypeService) {}

  /**
   * Get inquiry type all API
   * @summary Get inquiry type all API
   *
   * @tag Inuqiry-Type
   */
  @Get('/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getInquiryTypeAll(): Promise<GetInquiryTypeAllResponseDto> {
    const typeList = await this.inquiryTypeService.getTypeAll();

    return {
      typeList,
    };
  }
}
