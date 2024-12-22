import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

/**
 * OpenAI 객체 생성 대신 아래 객체를 사용하시는 것을 권장합니다.
 *
 * @author jochongs
 */
@Injectable()
export class OpenAIProvider extends OpenAI {
  constructor(private readonly configService: ConfigService) {
    const apiKey = configService.get('openAI').key;
    super({
      apiKey,
    });
  }
}
