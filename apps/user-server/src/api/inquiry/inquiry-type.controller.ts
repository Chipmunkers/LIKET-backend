import { Controller, Get } from '@nestjs/common';
import { InquiryTypeService } from './inquiry-type.service';
import { GetInquiryTypeAllResponseDto } from './dto/response/get-inquiry-type-response.dto';
import { LoginAuth } from '../auth/login-auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('/inquiry/type')
@ApiTags('Inquiry')
export class InquiryTypeController {
  constructor(private readonly inquiryTypeService: InquiryTypeService) {}

  /**
   * 문의 유형 목록 보기
   */
  @Get('/all')
  @LoginAuth()
  public async getInquiryTypeAll(): Promise<GetInquiryTypeAllResponseDto> {
    const typeList = await this.inquiryTypeService.getTypeAll();

    return {
      typeList,
    };
  }
}
