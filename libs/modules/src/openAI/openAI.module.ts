import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import openAIConfig from 'libs/modules/openAI/config/openAI.config';
import { OpenAIProvider } from 'libs/modules/openAI/openAI.provider';
import { OpenAIService } from 'libs/modules/openAI/openAI.service';
import { RetryUtilModule } from 'libs/modules/retry-util/retry-util.module';

@Module({
  imports: [ConfigModule.forFeature(openAIConfig), RetryUtilModule],
  providers: [OpenAIService, OpenAIProvider],
  exports: [OpenAIService, OpenAIProvider],
})
export class OpenAIModule {}
