import { Module } from '@nestjs/common';
import { TosService } from './tos.service';
import { TosController } from './tos.controller';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  providers: [TosService],
  controllers: [TosController],
})
export class TosModule {}
