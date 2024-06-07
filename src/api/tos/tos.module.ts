import { Module } from '@nestjs/common';
import { TosService } from './tos.service';
import { TosController } from './tos.controller';
import { PrismaModule } from '../../common/module/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TosController],
  providers: [TosService],
})
export class TosModule {}
