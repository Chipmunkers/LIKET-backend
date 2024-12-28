import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { Age, AGE, GET_MODE, MODE, Mode, Style, STYLE } from 'libs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;
  private readonly MODE: Mode;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({ apiKey: this.configService.get('openAI').key });

    this.MODE = GET_MODE();
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
  public async extractStyleAndAge(
    data: object,
    imgList: string[] = [],
  ): Promise<{ styleIdxList: Style[]; ageIdx: Age }> {
    if (this.MODE !== MODE.PRODUCT) {
      return {
        styleIdxList: [STYLE.ALONE, STYLE.ARTISTIC],
        ageIdx: AGE.ALL,
      };
    }

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `당신은 문화 콘텐츠 데이터를 분석하여 가장 적합한 스타일과 연령대를 결정하는 역할을 맡고 있습니다. 아래는 미리 정의된 스타일과 연령대 목록입니다:

                스타일: {
                    /** 혼자 */
                    ALONE: 1,
                    /** 함께 */
                    TOGETHER: 2,
                    /** 반려동물 */
                    PET: 3,
                    /** 가족 */
                    FAMILY: 4,
                    /** 포토존 */
                    PHOTO_SPOT: 5,
                    /** 체험 */
                    EXPERIENCE: 6,
                    /** 굿즈 */
                    GOODS: 7,
                    /** 로맨스 */
                    ROMANCE: 8,
                    /** 스포츠 */
                    SPORTS: 9,
                    /** 동양풍 */
                    ORIENTAL: 10,
                    /** 자연 */
                    NATURE: 11,
                    /** 만화 */
                    CARTOON: 12,
                    /** 재미있는 */
                    FUN: 13,
                    /** 귀여운 */
                    CUTE: 14,
                    /** 활기찬 */
                    LIVELY: 15,
                    /** 세련된 */
                    ELEGANT: 16,
                    /** 힙한 */
                    HIP: 17,
                    /** 핫한 */
                    HOT: 18,
                    /** 편안한 */
                    RELAXING: 19,
                    /** 힐링 */
                    HEALING: 20,
                    /** 감동 */
                    TOUCHING: 21,
                    /** 예술적인 */
                    ARTISTIC: 22,
                    /** 신비로운 */
                    MYSTERIOUS: 23,
                    /** 공포 */
                    HORROR: 24,
                    /** 미스터리 */
                    MYSTERY: 25,
                    /** 추리 */
                    DETECTIVE: 26,
                    /** 진지한 */
                    SERIOUS: 27,
                  }
  
                연령대: {
                    /** 전체 */
                    ALL: 1,
                    /** 아이들 */
                    CHILDREN: 2,
                    /** 10대 */
                    TEENS: 3,
                    /** 20대 */
                    TWENTIES: 4,
                    /** 30대 */
                    THIRTIES: 5,
                    /** 40-50대 */
                    FORTIES_FIFTIES: 6,
                  }
  
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
            ...imgList.map(
              (imgUrl) =>
                ({
                  type: 'image_url',
                  image_url: {
                    url: imgUrl,
                    detail: 'low',
                  },
                } as const),
            ),
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
                description: 'List of style indices (1-3 values).',
                type: 'array',
                items: { type: 'number' },
                minItems: 1,
                maxItems: 3,
              },
              ageIdx: {
                description: 'Selected age index',
                type: 'number',
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
   * !아래 메서드를 사용하지 않는 것을 권장드립니다.
   *
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

    const fileCreateResponse = await this.openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: 'fine-tune',
    });

    const jobCreateResponse = await this.openai.fineTuning.jobs.create({
      training_file: fileCreateResponse.id,
      model: 'gpt-4o-mini-2024-07-18',
    });

    return await this.openai.fineTuning.jobs.retrieve(jobCreateResponse.id);
  }

  private prepareFineTuningData(
    data: Object,
    styleIdxList: Style[],
    ageIdx: Age,
    why: string,
  ) {
    const question = `아래는 미리 정의된 스타일과 연령대 목록입니다:

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
}`;
    const expectResponse = `${JSON.stringify({
      ageIdx,
      styleIdxList,
    })}\n${why}`;

    return {
      message: [
        {
          role: 'system',
          content:
            '당신은 문화 콘텐츠 데이터를 분석하여 가장 적합한 스타일과 연령대를 결정하는 역할을 맡고 있습니다. ',
        },
        {
          role: 'user',
          content: question,
        },
        {
          role: 'assistant',
          content: expectResponse,
        },
      ],
    };
  }
}
