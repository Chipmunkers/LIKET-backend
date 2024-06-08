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
  Query,
} from '@nestjs/common';
import { LiketService } from './liket.service';
import { User } from '../user/user.decorator';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { UpdateLiketDto } from './dto/update-liket.dto';
import { LiketEntity } from './entity/liket.entity';
import { ApiTags } from '@nestjs/swagger';
import { Exception } from '../../common/decorator/exception.decorator';
import { LoginAuth } from '../auth/login-auth.decorator';
import { LiketAuthService } from './liket-auth.service';
import { LiketPagerbleDto } from './dto/liket-pagerble.dto';
import { GetLiketAllResponseDto } from './dto/response/get-liket-all.dto';

@Controller('liket')
export class LiketController {
  constructor(
    private readonly liketService: LiketService,
    private readonly liektAuthService: LiketAuthService,
  ) {}

  /**
   * 라이켓 목록 보기
   */
  @Get('/all')
  @HttpCode(200)
  @ApiTags('Liket')
  @Exception(400, 'Invalid querystring')
  @Exception(403, 'Permission denied')
  @LoginAuth()
  public async getLiketAll(
    @User() loginUser: LoginUserDto,
    @Query() pagerble: LiketPagerbleDto,
  ): Promise<GetLiketAllResponseDto> {
    await this.liektAuthService.checkReadAllPermission(loginUser, pagerble);

    return await this.liketService.getLiketAll(loginUser, pagerble);
  }

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
    await this.liektAuthService.checkReadPermission(loginUser, idx);

    const liket = await this.liketService.getLiketByIdx(idx);

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
    await this.liektAuthService.checkUpdatePermission(
      loginUser,
      idx,
      updateDto,
    );

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
    await this.liektAuthService.checkDeletePermission(loginUser, idx);

    await this.liketService.deleteLiketByIdx(idx);

    return;
  }
}
