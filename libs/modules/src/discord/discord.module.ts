import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import discordConfig from 'libs/modules/discord/config/discord.config';
import { DiscordService } from 'libs/modules/discord/discord.service';

@Module({
  imports: [HttpModule, ConfigModule.forFeature(discordConfig)],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
