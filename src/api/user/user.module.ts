import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../../hash/hash.service';
import { ReviewModule } from '../review/review.module';
import { CultureContentModule } from '../culture-content/culture-content.module';

@Module({
  imports: [PrismaModule, AuthModule, ReviewModule, CultureContentModule],
  controllers: [UserController],
  providers: [UserService, JwtService, HashService],
})
export class UserModule {}
