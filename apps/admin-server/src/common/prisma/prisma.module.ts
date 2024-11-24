import { Global, Module } from '@nestjs/common';
import { Prisma } from './prisma.service';

@Global()
@Module({
  providers: [Prisma],
  exports: [Prisma],
})
export class PrismaModule {}
