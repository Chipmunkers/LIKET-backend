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
import { NoticeService } from './notice.service';
import { NoticePageableDto } from './dto/request/notice-pageable.dto';
import { GetNoticeAllResponseDto } from './dto/response/get-notice-all-response.dto';
import { ApiResponse } from '@nestjs/swagger';
import { LoginAuth } from '../auth/login-auth.decorator';
import { NoticeEntity } from './entity/notice.entity';
import { CreateNoticeDto } from './dto/request/create-notice.dto';
import { UpdateNoticeDto } from './dto/request/update-notice.dto';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  /**
   * 공지사항 목록보기
   *
   * @author jochongs
   */
  @Get('/all')
  @ApiResponse({ status: 400, description: 'Invalid querystring' })
  @LoginAuth()
  public async getNoticeAll(
    @Query() pageable: NoticePageableDto,
  ): Promise<GetNoticeAllResponseDto> {
    return await this.noticeService.getNoticeAll(pageable);
  }

  /**
   * 공지사항 자세히보기
   *
   * @author jochongs
   */
  @Get('/:idx')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find notice' })
  @LoginAuth()
  public async getNoticeByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<NoticeEntity> {
    return await this.noticeService.getNoticeByIdx(idx);
  }

  /**
   * 공지사항 생성하기
   *
   * @author jochongs
   */
  @Post('/')
  @ApiResponse({ status: 400, description: 'Invalid body' })
  @LoginAuth()
  public async createNotice(@Body() createDto: CreateNoticeDto): Promise<NoticeEntity> {
    return await this.noticeService.createNotice(createDto);
  }

  /**
   * 공지사항 수정하기
   *
   * @author jochongs
   */
  @Put('/:idx')
  @ApiResponse({ status: 400, description: 'Invalid path parameter or body' })
  @ApiResponse({ status: 404, description: 'Cannot find notice' })
  @LoginAuth()
  public async updateNoticeByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() updateDto: UpdateNoticeDto,
  ): Promise<NoticeEntity> {
    return await this.noticeService.updateNoticeByIdx(idx, updateDto);
  }

  /**
   * 공지사항 삭제하기
   *
   * @author jochongs
   */
  @Delete('/:idx')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find notice' })
  @LoginAuth()
  public async deleteNoticeByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    await this.noticeService.deleteNoticeByIdx(idx);
  }

  /**
   * 공지사항 활성화하기
   *
   * @author jochongs
   */
  @Post('/:idx/activate')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find notice' })
  @ApiResponse({ status: 409, description: 'Already activated notice' })
  @LoginAuth()
  public async activateNoticeByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    await this.noticeService.activateNoticeByIdx(idx);
  }

  /**
   * 공지사항 비활성화하기
   *
   * @author jochongs
   */
  @Post('/:idx/deactivate')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find notice' })
  @ApiResponse({ status: 409, description: 'Already deactivated notice' })
  @LoginAuth()
  public async deactivateNoticeByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    await this.noticeService.deactivateNoticeByIdx(idx);
  }

  /**
   * 공지사항 상단 고정하기
   *
   * @author jochongs
   */
  @Post('/:idx/pin')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find notice' })
  @ApiResponse({ status: 409, description: 'Already pinned notice' })
  @LoginAuth()
  public async pinNoticeByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    await this.noticeService.pinNoticeByIdx(idx);
  }

  /**
   * 공지사항 상단 고정 해제하기
   *
   * @author jochongs
   */
  @Post('/:idx/unpin')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find notice' })
  @ApiResponse({ status: 409, description: 'Already unpinned notice' })
  @LoginAuth()
  public async unpinNoticeByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    await this.noticeService.unpinNoticeByIdx(idx);
  }
}
