import { Global, Module } from '@nestjs/common';
import { Prisma } from './prisma.service';

/**
 * @deprecated
 */
@Global()
@Module({
  providers: [Prisma],
  exports: [Prisma],
})
export class PrismaModule {}
