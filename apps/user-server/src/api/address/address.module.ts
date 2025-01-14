import { Module } from '@nestjs/common';
import { KakaoAddressModule } from 'libs/modules/kakao-address/kakao-address.module';
import { AddressService } from 'apps/user-server/src/api/address/address.service';
import { AddressController } from 'apps/user-server/src/api/address/address.controller';
import { PrismaModule } from 'libs/modules';
import { SkOpenApiModule } from 'libs/modules/sk-open-api/sk-open-api.module';

@Module({
  imports: [KakaoAddressModule, PrismaModule, SkOpenApiModule],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
