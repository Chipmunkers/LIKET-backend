import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import contentTokenConfig from 'apps/batch-server/src/content-token/config/content-token.config';
import { ContentTokenService } from 'apps/batch-server/src/content-token/content-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(contentTokenConfig)],
      useFactory: (configService: ConfigService) =>
        configService.get('contentToken') || {},
      inject: [ConfigService],
    }),
  ],
  providers: [ContentTokenService],
  exports: [ContentTokenService],
})
export class ContentTokenModule {}
