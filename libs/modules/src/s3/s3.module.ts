import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import s3Config from './config/s3.config';
import { HttpModule } from '@nestjs/axios';
import { S3Service } from './s3.service';

@Module({
  imports: [ConfigModule.forFeature(s3Config), HttpModule],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
