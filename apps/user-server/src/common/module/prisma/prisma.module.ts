import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * 해당 Prisma Module은 모노레포로 변경하는 과정에서 deprecated 되었습니다.
 * 대신, libs/
 *
 * @deprecated
 */
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
