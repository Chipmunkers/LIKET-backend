import { Module } from '@nestjs/common';
import { ContentTagService } from './content-tag.service';
import { ContentTagController } from './content-tag.controller';
import { ContentTagRepository } from './content-tag.repository';
import { RedisModule } from '../../common/module/redis/redis.module';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [ContentTagService, ContentTagRepository],
  controllers: [ContentTagController],
})
export class ContentTagModule {}
