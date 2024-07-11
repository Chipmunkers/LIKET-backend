import { Controller, Get, HttpCode, Param, ParseIntPipe } from '@nestjs/common';
import { TosService } from './tos.service';
import { GetTosAllResponseDto } from './dto/response/get-tos-all-response.dto';
import { TosEntity } from './entity/tos.entity';
import { Exception } from '../../common/decorator/exception.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('tos')
@ApiTags('Terms of Service')
export class TosController {
  constructor(private readonly tosService: TosService) {}

  /**
   * 약관 목록보기
   */
  @Get('/all')
  async getUserTosAll(): Promise<GetTosAllResponseDto> {
    const tosList = await this.tosService.getTosAll();

    return {
      tosList,
    };
  }

  /**
   * 약관 자세히보기
   */
  @Get('/:idx')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find Terms Of Service')
  async getTosByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<TosEntity> {
    const tos = await this.tosService.getTosByIdx(idx);

    return tos;
  }
}
