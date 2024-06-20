import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FILE_GROUPING } from './file-grouping';
import { UploadFileResponseDto } from './dto/response/upload-file-response.dto';
import { User } from '../user/user.decorator';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { LoginAuth } from '../auth/login-auth.decorator';
import { UploadFile } from './upload-file.decorator';
import { UploadFiles } from './upload-files.decorator';
import { ApiTags } from '@nestjs/swagger';
import { LoginUser } from '../auth/model/login-user';

@Controller('upload')
@ApiTags('Upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    @Logger('UploadController') private readonly logger: LoggerService,
  ) {}

  /**
   * 프로필 이미지 업로드하기
   */
  @Post('/profile-img')
  @HttpCode(200)
  @LoginAuth()
  @UploadFile('file', 'img')
  public async uploadProfileImg(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Cannot find uploaded file');
    }

    return await this.uploadService.uploadFileToS3(file, {
      destination: 'profile-img',
      grouping: FILE_GROUPING.PROFILE_IMG,
    });
  }

  /**
   * 문화생활컨텐츠 사진 업로드하기
   */
  @Post('/content-img')
  @HttpCode(200)
  @LoginAuth()
  @UploadFiles('files', 10, 'img')
  public async uploadCulutrContentImgs(
    @User() loginUser: LoginUser,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<UploadFileResponseDto[]> {
    if (!files || !files.length) {
      throw new BadRequestException('Cannot find uploaded file');
    }

    return await this.uploadService.uploadFilesToS3(
      files,
      {
        destinaion: 'culture-content',
        grouping: FILE_GROUPING.CULTURE_CONTENT,
      },
      loginUser.idx,
    );
  }

  /**
   * 문의 의미지 입력하기
   */
  @Post('/inquiry')
  @HttpCode(200)
  @LoginAuth()
  @UploadFiles('files', 10, 'img')
  public async uploadInquiryImgs(
    @User() loginUser: LoginUser,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<UploadFileResponseDto[]> {
    if (!files || !files.length) {
      throw new BadRequestException('Cannot find uploaded file');
    }

    return await this.uploadService.uploadFilesToS3(
      files,
      {
        destinaion: 'inquiry',
        grouping: FILE_GROUPING.INQUIRY,
      },
      loginUser.idx,
    );
  }

  /**
   * 리뷰 이미지 업로드하기
   */
  @Post('/review')
  @HttpCode(200)
  @LoginAuth()
  @UploadFiles('files', 10, 'img')
  public async uploadReviewImgs(
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<UploadFileResponseDto[]> {
    this.logger.log('uploadBannerImg', 'check uploaded file');
    if (!files || !files.length) {
      throw new BadRequestException('Cannot find uploaded file');
    }

    return await this.uploadService.uploadFilesToS3(files, {
      destinaion: 'review',
      grouping: FILE_GROUPING.REVIEW,
    });
  }

  /**
   * 라이켓 이미지 업로드하기
   */
  @Post('/liket')
  @HttpCode(200)
  @LoginAuth()
  @UploadFile('file', 'img')
  public async uploadLiketImg(@UploadedFiles() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Cannot find uploaded file');
    }

    return await this.uploadService.uploadFileToS3(file, {
      destination: 'liket',
      grouping: FILE_GROUPING.LIKET,
    });
  }
}
