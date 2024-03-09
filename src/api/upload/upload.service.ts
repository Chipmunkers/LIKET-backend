import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../../logger/logger.decorator';
import { LoggerService } from '../../logger/logger.service';
import { UtilService } from '../../util/util.service';
import { FILE_GROUPING } from './file-grouping';
import { UploadFileNotFoundException } from './exception/UploadFileNotFoundException';

@Injectable()
export class UploadService {
  private s3Client: S3Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly utilService: UtilService,
    @Logger('UploadService') private readonly logger: LoggerService,
  ) {
    this.s3Client = new S3Client(
      this.configService.get('s3') as S3ClientConfig,
    );
  }

  /**
   * Upload a file and save the uploaded file information in database
   */
  public async uploadFileToS3(
    file: Express.Multer.File,
    option: {
      destination: string;
      grouping: FILE_GROUPING;
    },
    userIdx?: number,
  ) {
    const result = await this.uploadToS3(file, option);

    await this.prisma.uploadFile.create({
      data: {
        filePath: result.filePath,
        userIdx: userIdx || null,
        grouping: option.grouping,
      },
    });

    return result;
  }

  /**
   * Upload files and svae upload files informations in database
   */
  public async uploadFilesToS3(
    files: Express.Multer.File[],
    option: {
      destinaion: string;
      grouping: FILE_GROUPING;
    },
    userIdx?: number,
  ): Promise<
    {
      fullUrl: string;
      fileName: string;
      fileExt: string;
      filePath: string;
    }[]
  > {
    this.logger.log('uploadFilesToS3', 'try to upload files');
    const uploadFiles = await Promise.all(
      files.map((file) =>
        this.uploadToS3(file, {
          destination: option.destinaion,
        }),
      ),
    );

    await this.prisma.uploadFile.createMany({
      data: uploadFiles.map((file) => ({
        filePath: file.filePath,
        userIdx: userIdx || null,
        grouping: option.grouping,
      })),
    });

    return uploadFiles;
  }

  /**
   * Check exist file
   */
  public async checkExistFile(
    filePath: string,
    userIdx: number,
    grouping: FILE_GROUPING,
  ): Promise<void> {
    const file = await this.prisma.uploadFile.findFirst({
      where: {
        filePath,
        grouping,
        userIdx,
        deletedAt: null,
      },
    });

    if (!file) {
      throw new UploadFileNotFoundException('Cannot find uploaded file');
    }

    return;
  }

  /**
   * Check exist files
   */
  public async checkExistFiles(
    filePaths: string[],
    userIdx: number,
    grouping: FILE_GROUPING,
  ): Promise<void> {
    this.logger.log('checkExistFiles', `filePaths: ${filePaths.toString()}`);
    const fileCount = await this.prisma.uploadFile.count({
      where: {
        filePath: {
          in: filePaths,
        },
        grouping,
        userIdx,
        deletedAt: null,
      },
    });

    this.logger.log('checkExistFiles', `find file count: ${fileCount}`);

    if (fileCount !== filePaths.length) {
      throw new UploadFileNotFoundException('Cannot find uploaded files');
    }

    return;
  }

  /**
   * Extract file extension from file name
   */
  private extractFileExt(fileName: string): string {
    return fileName.split('.')[fileName.split('.').length - 1];
  }

  /**
   * Upload file to S3
   */
  private async uploadToS3(
    file: Express.Multer.File,
    option: {
      destination: string;
    },
  ): Promise<{
    fullUrl: string;
    fileName: string;
    fileExt: string;
    filePath: string;
  }> {
    const region = this.configService.get('AWS_REGION');
    const bucketName = this.configService.get('S3_BUCKET_NAME');

    const fileName = this.utilService.getUUID();
    const fileExt = this.extractFileExt(file.originalname);

    const command = new PutObjectCommand({
      Bucket: `${bucketName}`,
      Key: `${option.destination}/${fileName}.${fileExt}`,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });

    this.logger.log(
      'imageUploadToS3',
      `upload file to s3\npath: /${option.destination}/${fileName}.${fileExt}`,
    );
    await this.s3Client.send(command);

    return {
      fullUrl: `https://s3.${region}.amazonaws.com/${bucketName}/${option.destination}/${fileName}.${fileExt}`,
      fileName: fileName,
      fileExt: fileExt,
      filePath: `/${option.destination}/${fileName}.${fileExt}`,
    };
  }
}
