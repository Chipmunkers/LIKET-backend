import { Module } from '@nestjs/common';
import { PrismaProvider } from './prisma.provider';

/**
 * Prisma Client를 사용하기 위한 모듈
 *
 * @author jochongs
 */
@Module({
  providers: [PrismaProvider],
  exports: [PrismaProvider],
})
export class PrismaModule {}
