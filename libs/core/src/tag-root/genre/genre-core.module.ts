import { Module } from '@nestjs/common';
import { GenreCoreRepository } from 'libs/core/tag-root/genre/genre-core.repository';
import { GenreCoreService } from 'libs/core/tag-root/genre/genre-core.service';

@Module({
  imports: [],
  providers: [GenreCoreService, GenreCoreRepository],
  exports: [GenreCoreService],
})
export class GenreCoreModule {}
