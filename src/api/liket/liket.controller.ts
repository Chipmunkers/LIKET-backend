import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LiketService } from './liket.service';
import { LiketEntity } from './entity/LiketEntity';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';
import { UpdateLiketDto } from './dto/UpdateLiketDto';

@Controller('liket')
export class LiketController {
  constructor(private readonly liketService: LiketService) {}

  /**
   * Get LIKET by idx API
   * @summary Get LIKET by idx API
   *
   * @tag LIKET
   */
  @Get('/:idx')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Permission denied')
  @TypedException<ExceptionDto>(404, 'Cannot find LIKET')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getLiketByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser: LoginUserDto,
  ): Promise<LiketEntity<'detail'>> {
    const liket = await this.liketService.getLiketByIdx(idx);

    if (liket.author.idx !== loginUser.idx) {
      throw new ForbiddenException('Permission denied');
    }

    return liket;
  }

  /**
   * Update LIKET by idx API
   * @summary Update LIKET by idx API
   *
   * @tag LIKET
   */
  @Put('/:idx')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter or body')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Permission denied')
  @TypedException<ExceptionDto>(404, 'Cannot find LIKET')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async updateLiketByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser: LoginUserDto,
    @Body() updateDto: UpdateLiketDto,
  ) {
    const liket = await this.liketService.getLiketByIdx(idx);

    if (liket.author.idx !== loginUser.idx) {
      throw new ForbiddenException('Permission denied');
    }

    await this.liketService.updateLiketByIdx(idx, updateDto);

    return;
  }
}
