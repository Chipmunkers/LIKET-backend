import { Module } from '@nestjs/common';
import { TosService } from './tos.service';
import { TosController } from './tos.controller';
import { PrismaModule } from 'libs/modules';
import { TosCoreModule } from 'libs/core/tos/tos-core.module';

@Module({
  imports: [TosCoreModule],
  controllers: [TosController],
  providers: [TosService],
})
export class TosModule {}
