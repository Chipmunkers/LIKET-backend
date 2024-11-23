import { Module } from '@nestjs/common';
import { MobileBatchController } from './mobile-batch.controller';
import { MobileBatchService } from './mobile-batch.service';

@Module({
  imports: [],
  controllers: [MobileBatchController],
  providers: [MobileBatchService],
})
export class MobileBatchModule {}
