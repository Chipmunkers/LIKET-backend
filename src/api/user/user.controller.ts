import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptionProvider } from '../upload/multer-option.provider';
import { UploadService } from '../upload/upload.service';
import { FILE_GROUPING } from '../upload/file-grouping';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
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
  @UseInterceptors(
    FileInterceptor(
      'file',
      MulterOptionProvider.createOption({
        mimetype: ['image/png', 'image/jpeg'],
        limits: 1 * 1024 * 1024,
      }),
    ),
  )
  public async localSignUp(
    @Body() signUpDto: SignUpDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<SignUpResponseDto> {
    if (file) {
      await this.uploadService.uploadFileToS3(file, {
        destination: 'profile-img',
        grouping: FILE_GROUPING.PROFILE_IMG,
      });
    }

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
}
