import { Module } from '@nestjs/common';
import { TosService } from './tos.service';
import { TosController } from './tos.controller';

@Module({
  controllers: [TosController],
  providers: [TosService],
})
export class TosModule {}
