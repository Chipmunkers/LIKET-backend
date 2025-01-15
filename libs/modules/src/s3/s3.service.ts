import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3UploadOptions } from './type/S3UploadOptions';
import { UploadedFileEntity } from './entity/uploaded-file.entity';
import { Upload } from '@aws-sdk/lib-storage';
import { S3UploadException } from 'libs/modules/s3/exception/S3UploadException';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  private readonly BUCKET_NAME: string;
  private readonly REGION: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const s3Config: S3ClientConfig =
      this.configService.get<S3ClientConfig>('s3') || {};

    this.s3Client = new S3Client(s3Config);
    this.BUCKET_NAME = configService.get<string>('S3_BUCKET_NAME') || '';
    this.REGION = this.configService.get('s3').region;
  }

  /**
   * 파일 URL을 통해 S3에 이미지 저장하기
   *
   * @author jochongs
   */
  public async uploadFileToS3ByUrl(
    url: string,
    options: S3UploadOptions,
  ): Promise<UploadedFileEntity> {
    const response = await this.httpService.axiosRef.get(url, {
      responseType: 'stream',
    });

    try {
      const contentType: string = response.headers['content-type'] || '';

      if (!contentType.includes('image')) {
        throw new Error('fail to download image');
      }

      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.BUCKET_NAME,
          Key: `${options.path}/${options.filename}`,
          Body: response.data,
          ACL: 'public-read',
        },
      });

      const result = await upload.done();

      return UploadedFileEntity.create({
        url: result.Location || '',
        name: options.filename,
        ext: this.extractFileExt(options.filename),
        path: `/${result.Key}`,
      });
    } catch (err) {
      throw new S3UploadException(err.message);
    }
  }

  /**
   * 버킷 명 가져오는 메서드
   *
   * @author jochongs
   */
  public getBucketName(): string {
    return this.BUCKET_NAME;
  }

  /**
   * 파일 확장자명 추출하기
   *
   * @author jochongs
   */
  private extractFileExt(fileName: string): string {
    return fileName.split('.')[fileName.split('.').length - 1];
  }
}
