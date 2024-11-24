import { Module } from '@nestjs/common';
import { CultureContentService } from './culture-content.service';
import { CultureContentController } from './culture-content.controller';

@Module({
  providers: [CultureContentService],
  controllers: [CultureContentController],
})
export class CultureContentModule {}
