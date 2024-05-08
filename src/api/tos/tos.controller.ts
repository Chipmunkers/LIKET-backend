import { Controller, Get, HttpCode, Param, ParseIntPipe } from '@nestjs/common';
import { TosService } from './tos.service';
import { GetTosAllResponseDto } from './dto/response/get-tos-all-response.dto';
import { TosEntity } from './entity/tos.entity';
import { Exception } from '../../common/decorator/exception.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('tos')
export class TosController {
  constructor(private readonly tosService: TosService) {}

  /**
   * Get all Terms Of Service API
   */
  @Get('/all')
  @HttpCode(200)
  @ApiTags('Terms of Service')
  async getUserTosAll(): Promise<GetTosAllResponseDto> {
    const tosList = await this.tosService.getTosAll();

    return {
      tosList,
    };
  }

  /**
   * Get Terms Of Service by idx API
   */
  @Get('/:idx')
  @HttpCode(200)
  @ApiTags('Terms of Service')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find Terms Of Service')
  async getTosByIdx(
    @Param('idx', ParseIntPipe) idx: number,
  ): Promise<TosEntity> {
    const tos = await this.tosService.getTosByIdx(idx);

    return tos;
  }
}
