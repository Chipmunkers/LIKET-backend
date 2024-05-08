import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignUpResponseDto } from './dto/response/sign-up-response.dto';
import { MyInfoEntity } from './entity/my-info.entity';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptionProvider } from '../upload/multer-option.provider';
import { UploadService } from '../upload/upload.service';
import { FILE_GROUPING } from '../upload/file-grouping';
import { ApiTags } from '@nestjs/swagger';
import { Exception } from '../../common/decorator/exception.decorator';
import { LoginAuth } from '../auth/login-auth.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Sign Up API
   */
  @Post('/local')
  @HttpCode(200)
  @ApiTags('User')
  @Exception(400, 'Invalid body')
  @Exception(401, 'Invalid email auth token')
  @Exception(409, 'Duplicated email or nickname')
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
   */
  @Get('/my')
  @HttpCode(200)
  @ApiTags('User')
  @Exception(401, 'There is no login access token')
  @Exception(404, 'Cannot find user')
  @LoginAuth()
  public async getMyInfo(
    @User() loginUser: LoginUserDto,
  ): Promise<MyInfoEntity> {
    return await this.userService.getMyInfo(loginUser.idx);
  }

  /**
   * Update login user profile API
   */
  @Put('/my/profile')
  @HttpCode(201)
  @ApiTags('User')
  @Exception(400, 'Invalid body')
  @Exception(404, 'Cannot find user')
  @LoginAuth()
  public async udpateUserInfo(
    @User() loginUser: LoginUserDto,
    @Body() updateDto: UpdateProfileDto,
  ): Promise<void> {
    await this.userService.updateProfile(loginUser.idx, updateDto);

    return;
  }
}
