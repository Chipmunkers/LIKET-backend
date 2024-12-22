import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Age, AGE, Style, STYLE } from 'libs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';
import { FsReadStream } from 'openai/_shims';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({ apiKey: configService.get('openAI').key });
  }

  /**
   * 이미지 속 텍스트를 추출하는 메서드.
   *
   * @author jochongs
   */
  public async extractTextFromImage(imgUrl: string) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '이미지 속 텍스트를 추출해. 만약 추출할 텍스트가 없는 경우 비어있는 문자열을 리턴하도록 해',
            },
            {
              type: 'image_url',
              image_url: {
                url: imgUrl,
              },
            },
          ],
        },
      ],
    });

    return completion.choices[0].message.content;
  }

  /**
   * @author jochongs
   */
  public async search(text: string) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'developer',
          content: [
            {
              type: 'text',
              text: text,
            },
          ],
        },
      ],
    });

    return completion.choices[0].message.content;
  }

  /**
   * 입력된 컨텐츠 데이터를 기반으로 style과 age를 추출하는 메서드
   *
   * @author jochongs
   */
  public async extractStyleAndAge(data: object) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'developer',
          content: [
            {
              type: 'text',
              text: `당신은 문화 콘텐츠 데이터를 분석하여 가장 적합한 스타일과 연령대를 결정하는 역할을 맡고 있습니다. 아래는 미리 정의된 스타일과 연령대 목록입니다:
  
                스타일: ${JSON.stringify(STYLE)}
  
                연령대: ${JSON.stringify(AGE)}
  
                다음 문화생활컨텐츠를 참고하십시오.
                ${JSON.stringify(data)}
  
                아래 질문에 답변하세요:
                1. 위 스타일 목록에서 이 콘텐츠에 가장 적합한 스타일은 무엇입니까? 1~3개를 선택하고 그 이유를 설명하세요.
                2. 위 연령대 목록에서 이 콘텐츠에 가장 적합한 연령대를 하나 선택하고 그 이유를 설명하세요. 콘텐츠의 장르와 일반적인 관객층을 반드시 고려하세요.
  
                아래 JSON 형식으로 응답을 제공하세요:
                {
                  "styleIdxList": [number, number, number], // 선택한 스타일의 인덱스 목록
                  "ageIdx": number // 선택한 연령대의 인덱스
                }`,
            },
          ],
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'style_and_age_schema',
          schema: {
            type: 'object',
            properties: {
              styleIdxList: {
                description: 'List of style indices (1-3 values)',
                type: 'array',
                items: { type: 'number' },
                minItems: 1,
                maxItems: 3,
              },
              ageIdx: {
                description: 'Selected age index',
                type: 'number',
              },
              why: {
                description:
                  '왜 styleIdxList와 ageIdx를 그렇게 선택했는지 상세하게 설명해줘. 한국어로 설명해줘.',
                type: 'string',
              },
            },
            required: ['styleIdxList', 'ageIdx'],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(completion.choices[0].message.content || '');
  }

  /**
   * @author jochongs
   */
  public async fineTuningContentStyleAndAge(
    data: Object,
    styleIdxList: Style[],
    ageIdx: Age,
    why: string,
  ) {
    const filePath = 'test-data/fine-tune/data.jsonl';
    const preparedData = JSON.stringify(
      this.prepareFineTuningData(data, styleIdxList, ageIdx, why),
    );
    fs.writeFileSync(filePath, preparedData);

    const fileResponse = await this.openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: 'fine-tune',
    });

    return await this.openai.fineTuning.jobs.create({
      training_file: fileResponse.id,
      model: 'gpt-3.5-turbo',
    });
  }

  private prepareFineTuningData(
    data: Object,
    styleIdxList: Style[],
    ageIdx: Age,
    why: string,
  ): {
    prompt: string;
    completion: string;
  } {
    return {
      prompt: `당신은 문화 콘텐츠 데이터를 분석하여 가장 적합한 스타일과 연령대를 결정하는 역할을 맡고 있습니다. 아래는 미리 정의된 스타일과 연령대 목록입니다:

스타일: ${JSON.stringify(STYLE)}

연령대: ${JSON.stringify(AGE)}

다음 문화생활컨텐츠를 참고하십시오.
${JSON.stringify(data)}

아래 질문에 답변하세요:
1. 위 스타일 목록에서 이 콘텐츠에 가장 적합한 스타일은 무엇입니까? 1~3개를 선택하고 그 이유를 설명하세요.
2. 위 연령대 목록에서 이 콘텐츠에 가장 적합한 연령대를 하나 선택하고 그 이유를 설명하세요. 콘텐츠의 장르와 일반적인 관객층을 반드시 고려하세요.

아래 JSON 형식으로 응답을 제공하세요:
{
  "styleIdxList": [number, number, number], // 선택한 스타일의 인덱스 목록
  "ageIdx": number // 선택한 연령대의 인덱스
}`,
      completion: `${JSON.stringify({ ageIdx, styleIdxList })}\n${why}`,
    };
  }
}
