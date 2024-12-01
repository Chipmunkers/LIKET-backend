import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Logger } from '../../common/module/logger/logger.decorator';
import { LoggerService } from '../../common/module/logger/logger.service';
import { UtilService } from '../../common/module/util/util.service';
import { FILE_GROUPING } from './file-grouping';
import { UploadedFileEntity } from './entity/uploaded-file.entity';

@Injectable()
export class UploadService {
  private s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly utilService: UtilService,
    @Logger(UploadService.name) private readonly logger: LoggerService,
  ) {
    this.s3Client = new S3Client(
      this.configService.get('s3') as S3ClientConfig,
    );
  }

  /**
   * Upload a file and save the uploaded file information in database
   *
   * @author jochongs
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

    return result;
  }

  /**
   * Upload files and svae upload files informations in database
   *
   * @author jochongs
   */
  public async uploadFilesToS3(
    files: Express.Multer.File[],
    option: {
      destinaion: string;
      grouping: FILE_GROUPING;
    },
    userIdx?: number,
  ): Promise<UploadedFileEntity[]> {
    this.logger.log(this.uploadFilesToS3, 'Attempt to upload files');
    return await Promise.all(
      files.map((file) =>
        this.uploadToS3(file, {
          destination: option.destinaion,
        }),
      ),
    );
  }

  /**
   * Extract file extension from file name
   *
   * @author jochongs
   */
  private extractFileExt(fileName: string): string {
    return fileName.split('.')[fileName.split('.').length - 1];
  }

  /**
   * Upload file to S3
   *
   * @author jochongs
   */
  private async uploadToS3(
    file: Express.Multer.File,
    option: {
      destination: string;
    },
  ): Promise<UploadedFileEntity> {
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
      this.uploadToS3,
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
