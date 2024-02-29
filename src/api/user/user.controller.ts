import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/SignUpDto';
import { TypedException } from '@nestia/core';
import { ExceptionDto } from '../../common/dto/ExceptionDto';
import { SignUpResponseDto } from './dto/response/SignUpResponseDto';
import { MyInfoEntity } from './entity/MyInfoEntity';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';
import { UpdateProfileDto } from './dto/UpdateProfileDto';
import { UserListPagenationDto } from './dto/UserListPaginationDto';
import { GetUserAllForAdminDto } from './dto/response/GetUserAllForAdminDto';
import { UserEntity } from './entity/UserEntity';
import { GetReviewAllByUseridxResponseDto } from './dto/response/GetReviewAllByUserIdxResponseDto';
import { ReviewService } from '../review/review.service';
import { ReviewListByUserPagerbleDto } from '../review/dto/ReviewListByUserPagerbleDto';
import { GetMyContentAllResponseDto } from './dto/response/GetMyContentAllReseponseDto';
import { ContentListByUserIdxPagerbleDto } from '../culture-content/dto/ContentListByUserIdxPagerbleDto';
import { CultureContentService } from '../culture-content/culture-content.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly reviewService: ReviewService,
    private readonly contentService: CultureContentService,
  ) {}

  /**
   * Sign Up API
   * @summary Sign Up API
   *
   * @tag User
   */
  @Post('/local')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid body')
  @TypedException<ExceptionDto>(401, 'Invalid email auth token')
  @TypedException<ExceptionDto>(409, 'Duplicated email or nickname')
  @TypedException<ExceptionDto>(500, 'Server Error')
  public async localSignUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<SignUpResponseDto> {
    const token = await this.userService.signUp(signUpDto);

    return { token };
  }

  /**
   * Get my info API
   * @summary Get my info API
   *
   * @tag User
   */
  @Get('/my')
  @HttpCode(200)
  @TypedException<ExceptionDto>(401, 'There is no login access token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(404, 'Cannot find user')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getMyInfo(
    @User() loginUser: LoginUserDto,
  ): Promise<MyInfoEntity> {
    return await this.userService.getMyInfo(loginUser.idx);
  }

  /**
   * Update login user profile API
   * @summary Update login user profile API
   *
   * @tag User
   */
  @Put('/my/profile')
  @HttpCode(201)
  @TypedException<ExceptionDto>(400, 'Invalid body')
  @TypedException<ExceptionDto>(401, 'There is no login access token')
  @TypedException<ExceptionDto>(403, 'Suspended user')
  @TypedException<ExceptionDto>(404, 'Cannot find user')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async udpateUserInfo(
    @User() loginUser: LoginUserDto,
    @Body() updateDto: UpdateProfileDto,
  ): Promise<void> {
    await this.userService.updateProfile(loginUser.idx, updateDto);

    return;
  }

  /**
   * Get user all for admin
   * @summary Get user all API for admin
   *
   * @tag User
   */
  @Get('/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid querystring')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Permission denied')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getUserAllForAdmin(
    @User() loginUser: LoginUserDto,
    @Query() pagenation: UserListPagenationDto,
  ): Promise<GetUserAllForAdminDto> {
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    return await this.userService.getUserAll(pagenation);
  }

  /**
   * Get user by idx for admin API
   * @summary Get user by idx API for admin
   *
   * @tag User
   */
  @Get('/:idx')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Permission denied')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getUserByIdx(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) userIdx: number,
  ): Promise<UserEntity<'my', 'admin'>> {
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    return await this.userService.getUserByIdx(userIdx);
  }

  /**
   * Suspend user by idx API for admin
   * @summary Suspend user by idx API for admin
   *
   * @tag User
   */
  @Post('/:idx/block')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Permission denied')
  @TypedException<ExceptionDto>(404, 'Cannot find user')
  @TypedException<ExceptionDto>(409, 'Already suspended user')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async blockUser(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) userIdx: number,
  ): Promise<void> {
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    await this.userService.blockUser(userIdx);

    return;
  }

  /**
   * Suspend user by idx API for admin
   * @summary Suspend user by idx API for admin
   *
   * @tag User
   */
  @Post('/:idx/cancel-block')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Permission denied')
  @TypedException<ExceptionDto>(404, 'Cannot find user')
  @TypedException<ExceptionDto>(409, 'Already not suspended user')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async cancelToBlockUser(
    @User() loginUser: LoginUserDto,
    @Param('idx', ParseIntPipe) userIdx: number,
  ): Promise<void> {
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    await this.userService.cancelToBlock(userIdx);

    return;
  }

  /**
   * Get review all by user idx API
   * @summary Get review all by user idx API
   *
   * @tag User
   */
  @Get('/:idx/review/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Permission denied')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getReviewAllByUserIdx(
    @User() loginUser: LoginUserDto,
    @Query() pagerble: ReviewListByUserPagerbleDto,
    @Param('idx', ParseIntPipe) userIdx: number,
  ): Promise<GetReviewAllByUseridxResponseDto> {
    if (loginUser.idx !== userIdx && !loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    return await this.reviewService.getReviewAllByUserIdx(
      userIdx,
      loginUser.idx,
      pagerble,
    );
  }

  /**
   * Get my culture-content and request all API
   * @summary Get my culture-content and request all API
   *
   * @tag User
   */
  @Get('/my/culture-content/all')
  @HttpCode(200)
  @TypedException<ExceptionDto>(400, 'Invalid path parameter')
  @TypedException<ExceptionDto>(401, 'No token or invalid token')
  @TypedException<ExceptionDto>(403, 'Permission denied')
  @TypedException<ExceptionDto>(500, 'Server Error')
  @UseGuards(LoginAuthGuard)
  public async getMyCultureContentAll(
    @User() loginUser: LoginUserDto,
    @Query() pagerble: ContentListByUserIdxPagerbleDto,
  ): Promise<GetMyContentAllResponseDto> {
    return await this.contentService.getContentByUserIdx(
      loginUser.idx,
      pagerble,
    );
  }
}
