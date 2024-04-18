import { Controller, Get, HttpCode, Param, ParseIntPipe } from '@nestjs/common';
import { TosService } from './tos.service';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { GetUserTosAllResponseDto } from './dto/response/GetUserTosAllResponseDto';

@Controller('tos')
export class TosController {
  constructor(private readonly tosService: TosService) {}

  @Get('/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(500, 'Server Error')
  async getUserTosAll(): Promise<GetUserTosAllResponseDto> {
    const tosList = await this.tosService.getTosAll();

    return {
      tosList,
    };
  }
}
