import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashService } from '../../common/service/hash.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, HashService],
  exports: [AuthService],
})
export class AuthModule {}
