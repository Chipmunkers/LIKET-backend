import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAuth } from '../auth/login-auth.decorator';
import { InquiryPagerbleDto } from './dto/request/inquiry-pagerble.dto';
import { GetInquiryResponseDto } from './dto/response/get-inquiry-response.dto';
import { GetInquiryAllResponseDto } from './dto/response/get-inquiry-all-response.dto';
import { GetInquiryTypeAllResponseDto } from './dto/response/get-inquiry-type-all-response.dto';
import { CreateAnswerDto } from './dto/request/create-answer.dto';
import { UpdateAnswerDto } from './dto/request/update-answer.dto';

@Controller('inquiry')
@ApiTags('Inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  /**
   * 문의 목록 보기
   */
  @Get('/all')
  @ApiResponse({ status: 400, description: 'Invalid querystring' })
  @LoginAuth()
  async getInquiryAll(@Query() pagerble: InquiryPagerbleDto): Promise<GetInquiryAllResponseDto> {
    return await this.inquiryService.getInquiryAll(pagerble);
  }

  /**
   * 문의 자세히보기
   */
  @Get('/:idx')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find inquiry' })
  @LoginAuth()
  async getInquiryByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<GetInquiryResponseDto> {
    const inquiry = await this.inquiryService.getInquiryByIdx(idx);

    return { inquiry };
  }

  /**
   * 문의 유형 목록보기
   */
  @Get('/type/all')
  @LoginAuth()
  async getInquiryTypeAll(): Promise<GetInquiryTypeAllResponseDto> {
    return await this.inquiryService.getInquiryTypeAll();
  }

  /**
   * 문의 답변하기
   */
  @Post('/:idx/answer')
  @ApiResponse({ status: 400, description: 'Invalid path parameter or body' })
  @ApiResponse({ status: 404, description: 'Cannot find inquiry' })
  @ApiResponse({ status: 409, description: 'Already has answer' })
  @LoginAuth()
  async createAnswerByInquiryIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() createDto: CreateAnswerDto,
  ): Promise<void> {
    await this.inquiryService.createAnswerByInquiryIdx(idx, createDto);
  }

  /**
   * 문의 답변 수정하기
   */
  @Put('/answer/:idx')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find answer' })
  @LoginAuth()
  async updateAnswerByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() updateDto: UpdateAnswerDto,
  ): Promise<void> {
    await this.inquiryService.getAnswerByIdx(idx);

    await this.inquiryService.updateAnswerByIdx(idx, updateDto);

    return;
  }

  /**
   * 문의 답변 삭제하기
   */
  @Delete('/answer/:idx')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find answer' })
  @LoginAuth()
  async deleteAnswerByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    await this.inquiryService.getAnswerByIdx(idx);

    await this.inquiryService.deleteAnswerByIdx(idx);

    return;
  }
}
