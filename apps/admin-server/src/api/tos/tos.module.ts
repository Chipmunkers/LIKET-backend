import { Module } from '@nestjs/common';
import { TosService } from './tos.service';
import { TosController } from './tos.controller';

@Module({
  providers: [TosService],
  controllers: [TosController],
})
export class TosModule {}
