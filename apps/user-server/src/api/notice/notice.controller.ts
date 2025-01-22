import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { Exception } from '../../common/decorator/exception.decorator';
import { NoticePageableDto } from './dto/notice-pageable.dto';
import { GetNoticeAllResponseDto } from './dto/response/get-notice-all-response.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('notice')
@ApiTags('Notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  /**
   * 공지사항 목록보기
   *
   * @author jochongs
   */
  @Get('/all')
  @Exception(400, 'Invalid querystring')
  public async getNoticeAll(
    @Query() pageable: NoticePageableDto,
  ): Promise<GetNoticeAllResponseDto> {
    const noticeList = await this.noticeService.getNoticeAll(pageable);

    return { noticeList };
  }

  /**
   * 공지사항 자세히보기
   *
   * @author jochongs
   */
  @Get('/:idx')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find notice')
  public async getNoticeByIdx(@Param('idx', ParseIntPipe) idx: number) {
    return await this.noticeService.getNoticeByIdx(idx);
  }
}
