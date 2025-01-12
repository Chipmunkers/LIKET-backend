import { Module } from '@nestjs/common';
import { CultureContentService } from './culture-content.service';
import { CultureContentController } from './culture-content.controller';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  providers: [CultureContentService],
  controllers: [CultureContentController],
})
export class CultureContentModule {}
