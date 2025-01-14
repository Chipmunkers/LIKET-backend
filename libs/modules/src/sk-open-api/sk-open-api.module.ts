import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import skOpenApiConfig from 'libs/modules/sk-open-api/config/sk-open-api.config';
import { SkOpenApiProvider } from 'libs/modules/sk-open-api/sk-open-api.provider';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(skOpenApiConfig)],
  providers: [SkOpenApiProvider],
  exports: [SkOpenApiProvider],
})
export class SkOpenApiModule {}
