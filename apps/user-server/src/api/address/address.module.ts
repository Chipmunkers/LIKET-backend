import { Module } from '@nestjs/common';
import { KakaoAddressModule } from 'libs/modules/kakao-address/kakao-address.module';
import { AddressService } from 'apps/user-server/src/api/address/address.service';
import { AddressController } from 'apps/user-server/src/api/address/address.controller';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [KakaoAddressModule, PrismaModule],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
