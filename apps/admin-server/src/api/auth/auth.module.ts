import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HashModule } from '../../common/hash/hash.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [HashModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
