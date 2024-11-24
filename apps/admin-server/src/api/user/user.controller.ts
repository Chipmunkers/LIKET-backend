import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUserResponseDto } from './dto/response/get-user-response.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAuth } from '../auth/login-auth.decorator';
import { GetUserAllResponseDto } from './dto/response/get-user-all-response.dto';
import { GetUserAllPagerbleDto } from './dto/request/get-user-all-pagerble.dto';
import { BlockUserDto } from './dto/request/block-user.dto';
import { GetDeleteReasonAllResponseDto } from './dto/response/get-delete-reason-all-response.dto';
import { GetDeleteReasonPagerbleDto } from './dto/request/get-delete-reason-pagerble.dto';
import { DeleteReasonService } from './delete-reason.service';
import { GetDeleteUserTypeResponseDto } from './dto/response/get-delete-user-type-all-response.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly deleteReasonService: DeleteReasonService,
  ) {}

  /**
   * 사용자 목록보기
   */
  @Get('/all')
  @ApiTags('User')
  @ApiResponse({ status: 400, description: 'Invalid querystring' })
  @LoginAuth()
  async getUserAll(@Query() pagerble: GetUserAllPagerbleDto): Promise<GetUserAllResponseDto> {
    return await this.userService.getUserAll(pagerble);
  }

  /**
   * 사용자 자세히보기
   */
  @Get('/:idx')
  @ApiTags('User')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find user' })
  @LoginAuth()
  async getUesrByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<GetUserResponseDto> {
    const user = await this.userService.getUserByIdx(idx);

    const countData = await this.userService.getUserContentsCount(idx);

    return { user, ...countData };
  }

  /**
   * 사용자 정지하기
   */
  @Post('/:idx/block')
  @ApiTags('User')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find user' })
  @ApiResponse({ status: 409, description: 'Already suspended user' })
  @LoginAuth()
  async blockUserByIdx(
    @Param('idx', ParseIntPipe) idx: number,
    @Body() blockUserDto: BlockUserDto,
  ): Promise<void> {
    await this.userService.getUserByIdx(idx);

    await this.userService.blockUserByIdx(idx, blockUserDto);

    return;
  }

  /**
   * 정지 취소하기
   */
  @Post('/:idx/cancel-block')
  @ApiTags('User')
  @ApiResponse({ status: 400, description: 'Invalid path parameter' })
  @ApiResponse({ status: 404, description: 'Cannot find user' })
  @LoginAuth()
  async cancelToBlockByIdx(@Param('idx', ParseIntPipe) idx: number): Promise<void> {
    await this.userService.getUserByIdx(idx);

    await this.userService.cancelToBlockUserByIdx(idx);

    return;
  }

  /**
   * 탈퇴 사유 타입 목록 보기
   */
  @Get('/delete-reason/type/all')
  @ApiTags('User')
  @LoginAuth()
  async getDeleteUserTypeAll(): Promise<GetDeleteUserTypeResponseDto> {
    const typeList = await this.deleteReasonService.getDeleteUserTypeAll();

    return { typeList };
  }

  /**
   * 탈퇴 사유 목록 보기
   */
  @Get('/delete-reason/all')
  @ApiTags('User')
  @ApiResponse({ status: 400, description: 'Invalid querystring' })
  @LoginAuth()
  async getDeleteReasonAll(
    @Query() pagerble: GetDeleteReasonPagerbleDto,
  ): Promise<GetDeleteReasonAllResponseDto> {
    return await this.deleteReasonService.getDeleteReasonAll(pagerble);
  }
}
