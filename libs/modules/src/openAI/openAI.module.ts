import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import openAIConfig from 'libs/modules/openAI/config/openAI.config';
import { OpenAIService } from 'libs/modules/openAI/openAI.service';

@Module({
  imports: [ConfigModule.forFeature(openAIConfig)],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
