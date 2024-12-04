import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import kopisConfig from './config/kopis.config';
import { KopisPerformService } from './kopis-perform.service';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(kopisConfig)],
  providers: [KopisPerformService],
})
export class KopisPerformModule {}
