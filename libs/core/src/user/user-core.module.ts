import { Module } from '@nestjs/common';
import { UserCoreRepository } from 'libs/core/user/user-core.repository';
import { UserCoreService } from 'libs/core/user/user-core.service';
import { PrismaModule, PrismaProvider } from 'libs/modules';
import { ClsModule } from 'nestjs-cls';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { HashModule } from 'libs/modules/hash/hash.module';
import { WithdrawalReasonCoreModule } from 'libs/core/withdrawal-reason/withdrawal-reason-core.module';

@Module({
  imports: [PrismaModule, HashModule, WithdrawalReasonCoreModule],
  providers: [UserCoreService, UserCoreRepository],
  exports: [UserCoreService],
})
export class UserCoreModule {}
