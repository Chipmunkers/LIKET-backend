import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DeleteReasonService } from './delete-reason.service';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, DeleteReasonService],
})
export class UserModule {}
