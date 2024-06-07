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
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { User } from '../user/user.decorator';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { CreateInquiryResponseDto } from './dto/response/create-inquiry-response.dto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryEntity } from './entity/inquiry.entity';
import { ApiTags } from '@nestjs/swagger';
import { Exception } from '../../common/decorator/exception.decorator';
import { LoginAuth } from '../auth/login-auth.decorator';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  /**
   * 문의 자세히보기
   */
  @Get('/:idx')
  @HttpCode(200)
  @ApiTags('Inquiry')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find inquiry')
  @LoginAuth()
  public async getInquiryByIdx(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<InquiryEntity> {
    const inquiry = await this.inquiryService.getInquiryByIdx(idx);

    if (loginUser.idx !== inquiry.author.idx) {
      throw new ForbiddenException('Permission denied');
    }

    return inquiry;
  }

  /**
   * 문의 생성하기
   */
  @Post('/')
  @HttpCode(200)
  @ApiTags('Inquiry')
  @Exception(400, 'Invalid body')
  @LoginAuth()
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
   * 문의 삭제하기
   */
  @Delete('/:idx')
  @HttpCode(201)
  @ApiTags('Inquiry')
  @Exception(400, 'Invalid body')
  @Exception(404, 'Cannot find inquiry')
  @LoginAuth()
  public async updateInquiry(
    @Param('idx', ParseIntPipe) inquiryIdx: number,
    @User() loginUser: LoginUserDto,
  ): Promise<void> {
    const inquiry = await this.inquiryService.getInquiryByIdx(inquiryIdx);

    if (inquiry.author.idx !== loginUser.idx) {
      throw new ForbiddenException('Permission denied');
    }

    await this.inquiryService.deleteInquiry(inquiryIdx);

    return;
  }
}
