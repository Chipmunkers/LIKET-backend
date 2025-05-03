import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import instagramConfig from 'libs/modules/instagram/config/instagram.config';
import { InstagramService } from 'libs/modules/instagram/instagram.service';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(instagramConfig)],
  providers: [InstagramService],
  exports: [InstagramService],
})
export class InstagramModule {}
