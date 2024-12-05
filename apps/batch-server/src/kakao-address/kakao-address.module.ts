import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import kakaoAddressConfig from './config/kakao-address.config';
import { KakaoAddressService } from './kakao-address.service';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(kakaoAddressConfig)],
  providers: [KakaoAddressService],
})
export class KakaoAddressModule {}
