import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User } from '../user/user.decorator';
import { Exception } from '../../common/decorator/exception.decorator';
import { LoginAuth } from '../auth/login-auth.decorator';
import { LoginUser } from '../auth/model/login-user';
import { ApiTags } from '@nestjs/swagger';
import { CreateLiketDto } from './dto/create-liket.dto';
import { LiketService } from './liket.service';
import { LiketPageableDto } from './dto/liket-pageable.dto';
import { LiketAuthService } from './liket-auth.service';
import { UpdateLiketDto } from './dto/update-liket.dto';
import { GetLiketAllResponseDto } from 'apps/user-server/src/api/liket/dto/response/get-liket-all-response.dto';

@Controller()
@ApiTags('Liket')
export class LiketController {
  constructor(
    private readonly liketService: LiketService,
    private readonly liketAuthService: LiketAuthService,
  ) {}

  /**
   * 라이켓 목록 보기
   *
   * @author wherehows
   */
  @Get('/liket/all')
  @Exception(400, 'Invalid querystring')
  @Exception(403, 'Attempt to see liket list created by other user')
  @LoginAuth()
  public async getLiketAll(
    @Query() pageable: LiketPageableDto,
    @User() loginUser: LoginUser,
  ): Promise<GetLiketAllResponseDto> {
    await this.liketAuthService.checkReadAllPermissions(pageable, loginUser);
    return {
      liketList: await this.liketService.getLiketAll(pageable, loginUser),
    };
  }

  /**
   * 라이켓 생성하기
   *
   * @author wherehows
   */
  @Post('/review/:idx/liket')
  @Exception(400, 'Invalid body or path')
  @Exception(403, 'Attempt to create liket for review written by other user')
  @Exception(404, 'Cannot find review')
  @Exception(409, 'A Liket for review already exists')
  @HttpCode(200)
  @LoginAuth()
  public async createLiket(
    @Body() createDto: CreateLiketDto,
    @Param('idx', ParseIntPipe) reviewIdx: number,
    @User() loginUser: LoginUser,
  ) {
    return await this.liketService.createLiket(reviewIdx, createDto, loginUser);
  }

  /**
   * 라이켓 자세히보기
   *
   * @author wherehows
   */
  @Get('/liket/:idx')
  @Exception(400, 'Invalid path')
  @Exception(404, 'Cannot find liket')
  public async getLiketByIdx(@Param('idx', ParseIntPipe) idx: number) {
    return await this.liketService.getLiketByIdx(idx);
  }

  /**
   * 라이켓 수정하기
   *
   * @author wherehows
   */
  @Put('/liket/:idx')
  @Exception(400, 'Invalid path or body')
  @Exception(403, 'Attempt to update liket created by other user')
  @Exception(404, 'Cannot find liket')
  @HttpCode(200)
  public async updateLiket(
    @User() loginUser: LoginUser,
    @Param('idx', ParseIntPipe) reviewIdx: number,
    @Body() updateDto: UpdateLiketDto,
  ) {
    await this.liketAuthService.checkUpdatePermission(loginUser, reviewIdx);
    return await this.liketService.updateLiket(reviewIdx, updateDto);
  }

  /**
   * 라이켓 삭제하기
   *
   * @author wherehows
   */
  @Delete('/liket/:idx')
  @Exception(400, 'Invalid path')
  @Exception(403, 'Attempt to delete liket created by other user')
  @Exception(404, 'Cannot find liket')
  @HttpCode(201)
  @LoginAuth()
  public async deleteLiket(
    @User() loginUser: LoginUser,
    @Param('idx', ParseIntPipe) liketIdx: number,
  ) {
    await this.liketService.deleteLiket(liketIdx, loginUser);
  }
}
