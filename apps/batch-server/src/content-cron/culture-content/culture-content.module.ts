import { Module } from '@nestjs/common';
import { PrismaModule } from 'libs/modules';
import { CultureContentRepository } from './culture-content.repository';

@Module({
  imports: [PrismaModule],
  providers: [CultureContentRepository],
  exports: [CultureContentRepository],
})
export class CultureContentModule {}
