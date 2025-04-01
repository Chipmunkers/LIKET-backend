import { Module } from '@nestjs/common';
import { CultureContentController } from './culture-content.controller';
import { CultureContentService } from './culture-content.service';
import { ContentAuthService } from './content-auth.service';
import { ContentTagRepository } from '../content-tag/content-tag.repository';
import { ContentViewService } from './content-view.service';
import { PrismaModule } from 'libs/modules';
import { CultureContentCoreModule } from 'libs/core/culture-content/culture-content-core.module';
import { UserCoreModule } from 'libs/core/user/user-core.module';
import { AgeCoreModule } from 'libs/core/tag-root/age/age-core.module';
import { StyleCoreModule } from 'libs/core/tag-root/style/style-core.module';

@Module({
  imports: [
    PrismaModule,
    CultureContentCoreModule,
    UserCoreModule,
    AgeCoreModule,
    StyleCoreModule,
  ],
  controllers: [CultureContentController],
  providers: [
    CultureContentService,
    ContentAuthService,
    ContentTagRepository,
    CultureContentService,
    ContentViewService,
  ],
})
export class CultureContentModule {}
