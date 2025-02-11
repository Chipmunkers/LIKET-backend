import { Module } from '@nestjs/common';
import { StyleCoreRepository } from 'libs/core/tag-root/style/style-core.repository';
import { StyleCoreService } from 'libs/core/tag-root/style/style-core.service';

@Module({
  imports: [],
  providers: [StyleCoreService, StyleCoreRepository],
  exports: [StyleCoreService],
})
export class StyleCoreModule {}
