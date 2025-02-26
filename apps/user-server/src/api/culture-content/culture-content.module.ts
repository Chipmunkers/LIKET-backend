import { Module } from '@nestjs/common';
import { CultureContentController } from './culture-content.controller';
import { CultureContentService } from './culture-content.service';
import { ContentAuthService } from './content-auth.service';
import { CultureContentRepository } from './culture-content.repository';
import { ContentTagRepository } from '../content-tag/content-tag.repository';
import { ContentViewService } from './content-view.service';
import { PrismaModule } from 'libs/modules';
import { CultureContentCoreModule } from 'libs/core/culture-content/culture-content-core.module';
import { UserCoreModule } from 'libs/core/user/user-core.module';

@Module({
  imports: [PrismaModule, CultureContentCoreModule, UserCoreModule],
  controllers: [CultureContentController],
  providers: [
    CultureContentService,
    ContentAuthService,
    CultureContentRepository,
    ContentTagRepository,
    CultureContentService,
    ContentViewService,
  ],
  exports: [CultureContentRepository],
})
export class CultureContentModule {}
