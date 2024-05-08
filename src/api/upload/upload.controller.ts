import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptionProvider } from './multer-option.provider';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { FILE_GROUPING } from './file-grouping';
import { UploadFileResponseDto } from './dto/response/UploadFileResponseDto';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { Logger } from '../../logger/logger.decorator';
import { LoggerService } from '../../logger/logger.service';
import { LoginAuth } from '../auth/login-auth.decorator';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    @Logger('UploadController') private readonly logger: LoggerService,
  ) {}

  /**
   * Upload culture-content images
   *
   * @ignore
   */
  @Post('/content-img')
  @HttpCode(200)
  @LoginAuth()
  @UseInterceptors(
    FilesInterceptor(
      'files',
      10,
      MulterOptionProvider.createOption({
        mimetype: ['image/png', 'image/jpeg'],
        limits: 1 * 1024 * 1024,
      }),
    ),
  )
  public async uploadCulutrContentImgs(
    @User() loginUser: LoginUserDto,
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
   * Upload inquiry images
   *
   * @ignore
   */
  @Post('/inquiry')
  @HttpCode(200)
  @LoginAuth()
  @UseInterceptors(
    FilesInterceptor(
      'files',
      10,
      MulterOptionProvider.createOption({
        mimetype: ['image/png', 'image/jpeg'],
        limits: 1 * 1024 * 1024,
      }),
    ),
  )
  public async uploadInquiryImgs(
    @User() loginUser: LoginUserDto,
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
   * Upload banner image
   *
   * @ignore
   */
  @Post('/banner')
  @HttpCode(200)
  @LoginAuth()
  @UseInterceptors(
    FileInterceptor(
      'file',
      MulterOptionProvider.createOption({
        mimetype: ['image/png', 'image/jpeg'],
        limits: 1 * 1024 * 1024,
      }),
    ),
  )
  public async uploadBannerImg(
    @User() loginUser: LoginUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    this.logger.log('uploadBannerImg', 'check admin authenicate');
    if (!loginUser.isAdmin) {
      throw new ForbiddenException('Permission denied');
    }

    this.logger.log('uploadBannerImg', 'check uploaded file');
    if (!file) {
      throw new BadRequestException('Cannot find uploaded file');
    }

    return await this.uploadService.uploadFileToS3(file, {
      destination: 'banner',
      grouping: FILE_GROUPING.BANNER,
    });
  }

  /**
   * Upload review images
   *
   * @ignore
   */
  @Post('/review')
  @HttpCode(200)
  @LoginAuth()
  @UseInterceptors(
    FilesInterceptor(
      'file',
      10,
      MulterOptionProvider.createOption({
        mimetype: ['image/png', 'image/jpeg'],
        limits: 1 * 1024 * 1024,
      }),
    ),
  )
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
   * Upload LIKET images
   *
   * @ignore
   */
  @Post('/liket')
  @HttpCode(200)
  @LoginAuth()
  @UseInterceptors(
    FileInterceptor(
      'file',
      MulterOptionProvider.createOption({
        mimetype: ['image/png'],
        limits: 1 * 1024 * 1024,
      }),
    ),
  )
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
