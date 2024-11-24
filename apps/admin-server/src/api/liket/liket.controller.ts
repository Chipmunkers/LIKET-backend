import { Controller, Get, HttpCode, Param, ParseIntPipe, Query } from '@nestjs/common';
import { LiketService } from './liket.service';
import { LoginAuth } from '../auth/login-auth.decorator';
import { GetLiketAllPagerbleDto } from './dto/request/get-liket-all-pagerble.dto';
import { GetLiketAllResponseDto } from './dto/response/get-liket-all-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetLiketResponseDto } from './dto/response/get-liket-response.dto';

@Controller('liket')
export class LiketController {
  constructor(private readonly liketService: LiketService) {}

  /**
   * 라이켓 목록 보기
   */
  @Get('/all')
  @HttpCode(200)
  @ApiTags('Liket')
  @LoginAuth()
  async getLiketAll(@Query() pagerbleDto: GetLiketAllPagerbleDto): Promise<GetLiketAllResponseDto> {
    return await this.liketService.getLiketAll(pagerbleDto);
  }

  /**
   * 라이켓 자세히보기
   */
  @Get('/:idx')
  @HttpCode(200)
  @ApiTags('Liket')
  @LoginAuth()
  async getLiketByidx(@Param('idx', ParseIntPipe) idx: number): Promise<GetLiketResponseDto> {
    const liket = await this.liketService.getLiketByIdx(idx);

    return { liket };
  }
}
