import { Module } from '@nestjs/common';
import { TosService } from './tos.service';
import { TosController } from './tos.controller';
import { TosRepository } from './tos.repository';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  controllers: [TosController],
  providers: [TosService, TosRepository],
})
export class TosModule {}
