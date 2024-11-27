import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignUpResponseDto } from './dto/response/sign-up-response.dto';
import { MyInfoEntity } from './entity/my-info.entity';
import { User } from './user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptionProvider } from '../upload/multer-option.provider';
import { UploadService } from '../upload/upload.service';
import { FILE_GROUPING } from '../upload/file-grouping';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Exception } from '../../common/decorator/exception.decorator';
import { LoginAuth } from '../auth/login-auth.decorator';
import { UploadedFileEntity } from '../upload/entity/uploaded-file.entity';
import { LoginUser } from '../auth/model/login-user';
import { SocialSignUpDto } from './dto/social-sign-up.dto';
import { EmailDuplicateCheckDto } from './dto/email-duplicate-check.dto';
import { Response } from 'express';
import cookieConfig from '../auth/config/cookie.config';
import { FindPwDto } from './dto/find-pw.dto';
import { UserPwService } from './user-pw.service';
import { WithdrawalDto } from './dto/withdrawal.dto';
import { ResetPwDto } from './dto/reset-pw.dto';
import { UserEntity } from './entity/user.entity';
import { UpdateProfileImgDto } from './dto/update-profile-img.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userPwService: UserPwService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * 회원가입하기 (file 필드로 이미지 전송)
   *
   * @author jochongs
   */
  @Post('/local')
  @HttpCode(200)
  @Exception(400, 'Invalid body')
  @Exception(401, 'Invalid email auth token')
  @Exception(409, 'Duplicated email or nickname (Body)')
  @ApiConsumes('multipart/form-data')
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
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<SignUpResponseDto> {
    let uploadedFile: UploadedFileEntity | undefined;
    if (file) {
      uploadedFile = await this.uploadService.uploadFileToS3(file, {
        destination: 'profile-img',
        grouping: FILE_GROUPING.PROFILE_IMG,
      });
    }

    const loginToken = await this.userService.signUp(signUpDto, uploadedFile);
    res.cookie('refreshToken', loginToken.refreshToken, cookieConfig());

    return { token: loginToken.accessToken };
  }

  /**
   * 내 정보보기 (로그인 확인용)
   *
   * @author jochongs
   */
  @Get('/login')
  @LoginAuth()
  public async getLoginUserInfo(
    @User() loginUser: LoginUser,
  ): Promise<UserEntity> {
    return await this.userService.getUserByIdx(loginUser.idx);
  }

  /**
   * 소셜 회원가입 하기 (프로필 이미지 file로 전달)
   * 소셜 회원가입이 원터치 방식으로 변경됨에 따라 Deprecated됨
   *
   * @deprecated
   *
   * @author jochongs
   */
  @Post('/social')
  @ApiTags('Auth')
  @HttpCode(200)
  @Exception(400, 'Invalid body')
  @Exception(401, 'Invalid social jwt')
  @Exception(409, 'Duplicate email or nickname')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'file',
      MulterOptionProvider.createOption({
        mimetype: ['image/png', 'image/jpeg'],
        limits: 1 * 1024 * 1024,
      }),
    ),
  )
  public async socialSignUp(
    @Body() signUpDto: SocialSignUpDto,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<SignUpResponseDto> {
    let uploadedFile: UploadedFileEntity | undefined;
    if (file) {
      uploadedFile = await this.uploadService.uploadFileToS3(file, {
        destination: 'profile-img',
        grouping: FILE_GROUPING.PROFILE_IMG,
      });
    }

    const loginToken = await this.userService.socialUserSignUp(
      signUpDto,
      uploadedFile,
    );
    res.cookie('refreshToken', loginToken.refreshToken, cookieConfig());

    return { token: loginToken.accessToken };
  }

  /**
   * 내 정보 보기
   *
   * @author jochongs
   */
  @Get('/my')
  @HttpCode(200)
  @Exception(401, 'There is no login access token')
  @Exception(404, 'Cannot find user')
  @LoginAuth()
  public async getMyInfo(@User() loginUser: LoginUser): Promise<MyInfoEntity> {
    return await this.userService.getMyInfo(loginUser.idx);
  }

  /**
   * 프로필 수정하기
   *
   * @author jochongs
   */
  @Put('/my/profile')
  @HttpCode(201)
  @Exception(400, 'Invalid body')
  @Exception(404, 'Cannot find user')
  @LoginAuth()
  public async updateUserInfo(
    @User() loginUser: LoginUser,
    @Body() updateDto: UpdateProfileDto,
  ): Promise<void> {
    await this.userService.updateProfile(loginUser.idx, updateDto);

    return;
  }

  /**
   * 프로필 이미지 수정하기
   *
   * @author jochongs
   */
  @Put('/my/profile-img')
  @HttpCode(201)
  @Exception(400, 'Invalid body')
  @LoginAuth()
  public async updateProfileImg(
    @User() loginUser: LoginUser,
    @Body() updateDto: UpdateProfileImgDto,
  ): Promise<void> {
    await this.userService.updateProfileImg(loginUser, updateDto.profileImg);
  }

  /**
   * 이메일 중복 확안하기
   *
   * @author jochongs
   */
  @Post('/email/duplicate-check')
  @HttpCode(201)
  @Exception(400, 'invalid param')
  @Exception(409, '이미 가입된 이메일')
  async checkEmailDuplicate(
    @Body() checkDto: EmailDuplicateCheckDto,
  ): Promise<void> {
    return await this.userService.checkEmailDuplicate(checkDto);
  }

  /**
   * 비밀번호 찾기
   *
   * @author jochongs
   */
  @Post('/pw/find')
  @HttpCode(201)
  @Exception(400, 'invalid body')
  @Exception(401, 'invalid email token')
  @Exception(404, 'Cannot find user from email')
  async findPw(@Body() findPwDto: FindPwDto) {
    await this.userPwService.findPw(findPwDto);
    return;
  }

  /**
   * 비밀번호 변경하기
   *
   * @author jochongs
   */
  @Post('/pw/reset')
  @HttpCode(201)
  @Exception(400, 'invalid password')
  @LoginAuth()
  async resetPw(
    @Body() resetPwDto: ResetPwDto,
    @User() loginUser: LoginUser,
  ): Promise<void> {
    await this.userPwService.resetLoginUserPw(loginUser, resetPwDto);
  }

  /**
   * 회원탈퇴하기
   *
   * @author jochongs
   */
  @Delete('/')
  @HttpCode(201)
  @Exception(400, 'Invalid body')
  @LoginAuth()
  async withdrawal(
    @Body() withdrawalDto: WithdrawalDto,
    @User() loginUser: LoginUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.userService.withdrawal(loginUser, withdrawalDto);

    res.clearCookie('refreshToken');
  }
}
