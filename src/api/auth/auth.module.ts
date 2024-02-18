import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashService } from '../../common/service/hash.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashService],
  imports: [PrismaModule],
  exports: [AuthService],
})
export class AuthModule {}
