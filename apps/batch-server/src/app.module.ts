import { Module } from '@nestjs/common';
import { KopisModule } from './content-cron/external-apis/kopis/kopis.module';
import { ConfigModule } from '@nestjs/config';
import { KakaoAddressModule } from '../../../libs/modules/src/kakao-address/kakao-address.module';
import { ContentCronModule } from 'apps/batch-server/src/content-cron/content-cron.module';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { PrismaModule, PrismaProvider } from 'libs/modules';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Module({
  imports: [
    KopisModule,
    ConfigModule.forRoot(),
    KakaoAddressModule,
    ContentCronModule,
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
})
export class AppModule {}
