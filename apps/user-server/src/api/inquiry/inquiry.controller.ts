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
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { User } from '../user/user.decorator';
import { CreateInquiryResponseDto } from './dto/response/create-inquiry-response.dto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryEntity } from './entity/inquiry.entity';
import { ApiTags } from '@nestjs/swagger';
import { Exception } from '../../common/decorator/exception.decorator';
import { LoginAuth } from '../auth/login-auth.decorator';
import { LoginUser } from '../auth/model/login-user';
import { InquiryPagerbleDto } from './dto/inquiry-pagerble.dto';
import { InquiryAllResponseDto } from './dto/response/inquiry-all-response.dto';

@Controller('inquiry')
@ApiTags('Inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  /**
   * 문의 목록 보기
   *
   * @author jochongs
   */
  @Get('/all')
  @Exception(400, 'Invalid querystring')
  @Exception(401, 'No token or expired token')
  @LoginAuth()
  public async getMyInquiryAll(
    @User() loginUser: LoginUser,
    @Query() pagerbleDto: InquiryPagerbleDto,
  ): Promise<InquiryAllResponseDto> {
    return await this.inquiryService.getInquiryAllByLoginUser(
      loginUser,
      pagerbleDto,
    );
  }

  /**
   * 문의 자세히보기
   *
   * @author jochongs
   */
  @Get('/:idx')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find inquiry')
  @LoginAuth()
  public async getInquiryByIdx(
    @User() loginUser: LoginUser,
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
   *
   * @author jochongs
   */
  @Post('/')
  @HttpCode(200)
  @Exception(400, 'Invalid body')
  @LoginAuth()
  public async createInquiry(
    @User() loginUser: LoginUser,
    @Body() createDto: CreateInquiryDto,
  ): Promise<InquiryEntity> {
    return await this.inquiryService.createInquiry(loginUser.idx, createDto);
  }

  /**
   * 문의 삭제하기
   *
   * @author jochongs
   */
  @Delete('/:idx')
  @HttpCode(201)
  @Exception(400, 'Invalid body')
  @Exception(404, 'Cannot find inquiry')
  @LoginAuth()
  public async updateInquiry(
    @Param('idx', ParseIntPipe) inquiryIdx: number,
    @User() loginUser: LoginUser,
  ): Promise<void> {
    const inquiry = await this.inquiryService.getInquiryByIdx(inquiryIdx);

    if (inquiry.author.idx !== loginUser.idx) {
      throw new ForbiddenException('Permission denied');
    }

    await this.inquiryService.deleteInquiry(inquiryIdx);
  }
}
