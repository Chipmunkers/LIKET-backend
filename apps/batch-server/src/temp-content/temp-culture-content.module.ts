import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { KopisModule } from '../kopis-perform/kopis.module';

@Module({
  imports: [ScheduleModule.forRoot(), KopisModule],
  providers: [Logger],
})
export class TempContentModule {}
