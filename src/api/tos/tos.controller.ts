import { Controller, Get, HttpCode, Param, ParseIntPipe } from '@nestjs/common';
import { TosService } from './tos.service';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { GetUserTosAllResponseDto } from './dto/response/GetUserTosAllResponseDto';

@Controller('tos')
export class TosController {
  constructor(private readonly tosService: TosService) {}

  /**
   * Get all Terms Of Service API
   * @summary Get Terms Of Service API
   *
   * @tag Terms Of Service
   */
  @Get('/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(500, 'Server Error')
  async getUserTosAll(): Promise<GetUserTosAllResponseDto> {
    const tosList = await this.tosService.getTosAll();

    return {
      tosList,
    };
  }

  /**
   * Get Terms Of Service by idx API
   * @summary Get Terms Of Service by idx API
   *
   * @tag Terms Of Service
   */
  @Get('/:idx')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(404, 'Cannot find Terms Of Service')
  @TypedException<ExceptionDto>(500, 'Server Error')
  async getTosByIdx(@Param('idx', ParseIntPipe) idx: number) {
    const tos = await this.tosService.getTosByIdx(idx);

    return tos;
  }
}
