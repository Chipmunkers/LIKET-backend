import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UtilService } from '../util/util.service';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { FILE_GROUPING } from './dto/file-grouping';
import { UploadFileEntity } from './entity/upload-file.entity';

@Injectable()
export class UploadService {
  private s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly utilService: UtilService,
  ) {
    this.s3Client = new S3Client(this.configService.get('s3') || {});
  }

  public async uploadFileToS3(
    file: Express.Multer.File,
    option: {
      destination: string;
      grouping: FILE_GROUPING;
    },
    userIdx?: number,
  ): Promise<UploadFileEntity> {
    const result = await this.uploadToS3(file, option);

    return result;
  }

  public async uploadFilesToS3(
    files: Express.Multer.File[],
    option: {
      destinaion: string;
      grouping: FILE_GROUPING;
    },
    userIdx?: number,
  ): Promise<UploadFileEntity[]> {
    const uploadFiles = await Promise.all(
      files.map((file) =>
        this.uploadToS3(file, {
          destination: option.destinaion,
        }),
      ),
    );

    return uploadFiles;
  }

  private extractFileExt(fileName: string): string {
    return fileName.split('.')[fileName.split('.').length - 1];
  }

  private async uploadToS3(
    file: Express.Multer.File,
    option: {
      destination: string;
    },
  ): Promise<UploadFileEntity> {
    const region = this.configService.get('AWS_REGION');
    const bucketName = this.configService.get('S3_BUCKET_NAME');

    const fileName = this.utilService.generateRandomNumericString(6);
    const fileExt = this.extractFileExt(file.originalname);

    const command = new PutObjectCommand({
      Bucket: `${bucketName}`,
      Key: `${option.destination}/${fileName}.${fileExt}`,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    return {
      fullUrl: `https://s3.${region}.amazonaws.com/${bucketName}/${option.destination}/${fileName}.${fileExt}`,
      fileName: fileName,
      fileExt: fileExt,
      filePath: `/${option.destination}/${fileName}.${fileExt}`,
    };
  }
}
