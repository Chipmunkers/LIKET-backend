import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import kopisConfig from './config/kopis.config';
import { KopisPerformService } from './kopis-perform.service';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(kopisConfig)],
  providers: [KopisPerformService, Logger],
})
export class KopisPerformModule {}
