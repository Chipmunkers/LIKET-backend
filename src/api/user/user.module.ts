import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../../common/service/hash.service';
import { ReveiwModule } from '../review/reveiw.module';
import { CultureContentModule } from '../culture-content/culture-content.module';

@Module({
  imports: [PrismaModule, AuthModule, ReveiwModule, CultureContentModule],
  controllers: [UserController],
  providers: [UserService, JwtService, HashService],
})
export class UserModule {}
