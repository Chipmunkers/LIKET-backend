import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { LiketService } from './liket.service';
import { User } from '../user/user.decorator';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { UpdateLiketDto } from './dto/update-liket.dto';
import { LiketEntity } from './entity/liket.entity';
import { ApiTags } from '@nestjs/swagger';
import { Exception } from '../../common/decorator/exception.decorator';
import { LoginAuth } from '../auth/login-auth.decorator';

@Controller('liket')
export class LiketController {
  constructor(private readonly liketService: LiketService) {}

  /**
   * 라이켓 자세히보기
   */
  @Get('/:idx')
  @HttpCode(200)
  @ApiTags('Liket')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find LIKET')
  @LoginAuth()
  public async getLiketByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser: LoginUserDto,
  ): Promise<LiketEntity> {
    const liket = await this.liketService.getLiketByIdx(idx);

    if (liket.author.idx !== loginUser.idx) {
      throw new ForbiddenException('Permission denied');
    }

    return liket;
  }

  /**
   * 라이켓 수정하기
   */
  @Put('/:idx')
  @HttpCode(201)
  @ApiTags('Liket')
  @Exception(400, 'Invalid path parameter or body')
  @Exception(404, 'Cannot find LIKET')
  @LoginAuth()
  public async updateLiketByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser: LoginUserDto,
    @Body() updateDto: UpdateLiketDto,
  ): Promise<void> {
    const liket = await this.liketService.getLiketByIdx(idx);

    if (liket.author.idx !== loginUser.idx) {
      throw new ForbiddenException('Permission denied');
    }

    await this.liketService.updateLiketByIdx(idx, updateDto);

    return;
  }

  /**
   * 라이켓 삭제하기
   */
  @Delete('/:idx')
  @HttpCode(201)
  @ApiTags('Liket')
  @Exception(400, 'Invalid path parameter')
  @Exception(404, 'Cannot find LIKET')
  @LoginAuth()
  public async deleteLiketByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @User() loginUser: LoginUserDto,
  ): Promise<void> {
    const liket = await this.liketService.getLiketByIdx(idx);

    if (liket.author.idx !== loginUser.idx) {
      throw new ForbiddenException('Permission denied');
    }

    await this.liketService.deleteLiketByIdx(idx);

    return;
  }
}
