import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../../hash/hash.service';
import { UploadModule } from '../upload/upload.module';
import { HashModule } from '../../hash/hash.module';

@Module({
  imports: [PrismaModule, UploadModule, HashModule],
  controllers: [UserController],
  providers: [UserService, JwtService, HashService],
})
export class UserModule {}
