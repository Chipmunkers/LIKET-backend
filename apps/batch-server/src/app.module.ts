import { Module } from '@nestjs/common';
import { TempContentModule } from './temp-content/temp-culture-content.module';
import { KopisPerformModule } from './kopis-perform/kopis-perform.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TempContentModule, KopisPerformModule, ConfigModule.forRoot()],
})
export class AppModule {}
