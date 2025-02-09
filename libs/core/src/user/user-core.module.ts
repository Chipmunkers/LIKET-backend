import { Module } from '@nestjs/common';
import { UserCoreRepository } from 'libs/core/user/user-core.repository';
import { UserCoreService } from 'libs/core/user/user-core.service';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  providers: [UserCoreService, UserCoreRepository],
  exports: [UserCoreService],
})
export class UserCoreModule {}
