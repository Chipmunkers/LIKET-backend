import { Module } from '@nestjs/common';
import { TosService } from './tos.service';
import { TosController } from './tos.controller';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { TosRepository } from './tos.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TosController],
  providers: [TosService, TosRepository],
})
export class TosModule {}
