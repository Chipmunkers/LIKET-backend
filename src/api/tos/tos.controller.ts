import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TosService } from './tos.service';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { GetUserTosAllResponseDto } from './dto/response/GetUserTosAllResponseDto';
import { GetAdminTosAllResponseDto } from './dto/response/GetAdminTosAllResponseDto';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';

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

  /**
   * Get all Terms Of Service for Admin API
   * @summary Get all Terms Of Service for Admin API
   *
   * @tag Terms Of Service
   */
  @Get('/admin/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Permission denied')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  async getTosAllForAdmin(
    @User() user: LoginUserDto,
  ): Promise<GetAdminTosAllResponseDto> {
    if (!user.isAdmin) {
      throw new ForbiddenException('Permission Denied');
    }

    const tosList = await this.tosService.getTosAllForAdmin();

    return {
      tosList,
    };
  }
}
