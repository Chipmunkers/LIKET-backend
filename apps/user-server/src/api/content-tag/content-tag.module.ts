import { Module } from '@nestjs/common';
import { ContentTagService } from './content-tag.service';
import { ContentTagController } from './content-tag.controller';
import { GenreCoreModule } from 'libs/core/tag-root/genre/genre-core.module';
import { StyleCoreModule } from 'libs/core/tag-root/style/style-core.module';
import { AgeCoreModule } from 'libs/core/tag-root/age/age-core.module';

@Module({
  imports: [GenreCoreModule, StyleCoreModule, AgeCoreModule],
  providers: [ContentTagService],
  controllers: [ContentTagController],
})
export class ContentTagModule {}
