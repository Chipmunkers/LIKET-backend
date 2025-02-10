import { Module } from '@nestjs/common';
import { UserCoreRepository } from 'libs/core/user/user-core.repository';
import { UserCoreService } from 'libs/core/user/user-core.service';
import { PrismaModule, PrismaProvider } from 'libs/modules';
import { ClsModule } from 'nestjs-cls';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';

@Module({
  imports: [
    PrismaModule,
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaProvider,
          }),
        }),
      ],
    }),
  ],
  providers: [UserCoreService, UserCoreRepository],
  exports: [UserCoreService],
})
export class UserCoreModule {}
