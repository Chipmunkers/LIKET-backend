import { Module } from '@nestjs/common';
import { TempContentModule } from './temp-content/temp-culture-content.module';
import { KopisPerformModule } from './kopis-perform/kopis-perform.module';

@Module({
  imports: [TempContentModule, KopisPerformModule],
})
export class AppModule {}
