import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { RetryUtilService } from 'libs/modules/retry-util/retry-util.service';
import { GET_MODE, MODE, Mode } from 'libs/common';
import { AGE, Age } from 'libs/core/tag-root/age/constant/age';
import { STYLE, Style } from 'libs/core/tag-root/style/constant/style';
import OpenAI from 'openai';
import { ExtractedContentInfoEntity } from 'libs/modules/openAI/entity/extracted-content-info.entity';

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI;
  private readonly MODE: Mode;

  constructor(
    private readonly configService: ConfigService,
    private readonly retryUtilService: RetryUtilService,
  ) {
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

    return await this.retryUtilService.executeWithRetry(
      async () => {
        try {
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
                      }) as const,
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
        } catch (err) {
          throw err;
        }
      },
      {
        retry: 3,
        delay: 500,
      },
    );
  }

  /**
   * 본문과 이미지 URL을 기반으로 컨텐츠의 제목, 장르, 주소, 오픈 시간, 오픈 날짜, 오픈 종료 날짜를 반환하는 메서드
   *
   * @author jochongs
   */
  public async extractContentInfo(
    data: object,
    imgList: string[] = [],
  ): Promise<ExtractedContentInfoEntity> {
    // TODO: 아래 내용 반영할 지 결정해야함.
    // if (this.MODE !== MODE.PRODUCT) {
    //   return {
    //     title: '제목',
    //     genre: '장르',
    //     address: '주소',
    //     openTime: '오픈 시간',
    //     openDate: '오픈 날짜',
    //     openEndDate: '오픈 종료 날짜',
    //   };
    // }

    return await this.retryUtilService.executeWithRetry(
      async () => {
        try {
          const completion = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `당신은 문화 콘텐츠 데이터를 분석하여 제목, 장르, 주소, 오픈 시간, 오픈 날짜, 오픈 종료 날짜를 결정하는 역할을 맡고 있습니다. 아래는 미리 정의된 스타일과 연령대 목록입니다:
    
                    다음 문화생활컨텐츠를 참고하십시오.
                    ${JSON.stringify(data)}
      
                    아래 질문에 답변하세요:
                    1. 제목: 문화생활컨텐츠가 팝업이나 전시회일 경우 팝업스토어의 이름을 의미합니다.
                    2. 장르
                    3. 주소: 카카오 주소 검색 API로 검색할 수 있는 주소를 의미합니다.
                    4. 오픈 시간: 단순히 시간만을 의미합니다. HH:MM.AM ~ HH:MM.PM 형식이 좋고 요일별 날짜가 주어진 경우 요일별 날짜가 표시될 수 있도록 하십시오. 
                    5. 오픈 날짜
                    6. 오픈 종료 날짜
                    7. 자세한 주소: 건물이나 상호명 등, 보행자가 찾아올 수 있는 주소를 의미합니다.
                    8. 입장료 여부
                    9. 예약 여부
                    10. 주차 여부
                    11. 반려동물 동반 여부

                    반드시 주소와 자세한 주소는 구분되어야합니다. 주소는 카카오 주소 검색 API로 검색할 수 있는 주소를 의미합니다.
                    
                    예시. 이미지나 주어진 참고할 문화생활컨텐츠 데이터에 '- 장소 : SHIFT.G 성수 팝업 스토어 (서울시 성동구 연무장길 35, STAGE 35)'라는 텍스트가 있다면,
                    주소는 '서울시 성동구 연무장길 35'이고, 자세한 주소는 'STAGE 35'입니다. 물론 자세한 주소도 명시되어있지 않을 경우 빈 텍스트로 리턴해.
                    
                    입장료, 예약, 주차, 반려동물 동반 여부는 true, false로 구분되어야하며, 명시되어있지 않을 경우 false로 설정하십시오.

                    장르는 반드시 아래 목록 중 하나로 선택해야 합니다: 1~6
                    {
                      /** 팝업 스토어 */
                      POPUP_STORE: 1,
                      /** 전시회 */
                      EXHIBITION: 2,
                      /** 연극 */
                      THEATER: 3,
                      /** 뮤지컬 */
                      MUSICAL: 4,
                      /** 콘서트 */
                      CONCERT: 5,
                      /** 페스티벌 */
                      FESTIVAL: 6,
                    } as const;
      
                    아래 JSON 형식으로 응답을 제공하세요:
                    {
                      "title": "제목", <!-- 컨텐츠의 이름을 의미합니다. -->
                      "genre": "장르",
                      "address": "주소",
                      "openTime": "오픈 시간", <!-- YYYY-MM-DD -->
                      "startDate": "오픈 날짜", <!-- YYYY-MM-DD -->
                      "endDate": "오픈 종료 날짜",
                      "detailedAddress": "자세한 주소" <!-- 건물이나 상호명 등, 보행자가 찾아올 수 있는 주소를 의미합니다. -->
                      "isFee": boolean, <!-- 입장료 여부 -->
                      "isReservation": boolean, <!-- 예약 여부 -->
                      "isParking": boolean, <!-- 주차 여부 -->
                      "isPet": boolean <!-- 반려동물 동반 여부 -->
                      "reason": "startDate와 endDate를 작성한 것에 대한 근거"
                    }
                      
                    만약, 이미지와 본문 속에 제목, 주소, 오픈시간, 오픈 날짜, 오픈 종료 날짜가 포함되어 있지 않다면 비어있는 문자열을 리턴하도록 해.
                    그러나, 장르는 필수로 포함되어야 해.

                    이미지나 컨텐츠 데이터에 오픈 날짜와 오픈 종료 날짜가 명시되어 있더라도 연도가 포함되어있지 않을 수 있다.
                    이런 경우, 연도는 반드시 요청하는 현재 시간이 ${new Date().toISOString()}임을 참고하여 작성해.

                    만약 오픈 날짜가 12월 31일이고 오픈 종료 날짜가 1월 1일이며 연도가 명시되어있지 않은 경우,
                    오픈 날짜는 올해인 ${new Date().getFullYear()}년 12월 31일이지만 오픈 종료 날짜는 내년인 ${new Date().getFullYear() + 1}년 1월 1일로 작성해.
                    오픈 날짜와 오픈 종료 날짜가 같은 경우, 오픈 날짜와 오픈 종료 날짜는 반드시 같은 연도로 작성해야 해.

                    다만, startDate는 이미지와 본문 속에 명시되어 있지 않을 수도 있어. 그런 경우 빈 문자열로 작성해.
                    만약, 주어진 문화생활컨텐츠 데이터나 이미지 속에서 '오늘부터' 연다고 나온다면 그것은 반드시 문화생활컨텐츠의 createdAt필드를 기준으로 오늘이라는 점을 고려해야돼.
                    꼭 오늘이 아니더라도 피드 내용이나 이미지에 상대적인 시간이 적혀있다면 반드시 오늘 날짜가 아닌 문화생활컨텐츠의 createdAt필드를 기준으로 계산해야돼.

                    스토어나 장기 팝업스토어의 경우 종료 날짜가 정해지지 않는 경우도 있어. 그런 경우 endDate는 반드시 빈 문자열로 작성해.
                    `,
                  },
                  ...imgList.map(
                    (imgUrl) =>
                      ({
                        type: 'image_url',
                        image_url: {
                          url: imgUrl,
                          detail: 'low',
                        },
                      }) as const,
                  ),
                ],
              },
            ],
            response_format: {
              type: 'json_schema',
              json_schema: {
                name: 'content_info_schema',
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'number' },
                    genre: { type: 'string' },
                    address: { type: 'string' },
                    openTime: { type: 'string' },
                    startDate: { type: 'string' },
                    endDate: { type: 'string' },
                    detailedAddress: { type: 'string' },
                    isFee: { type: 'boolean' },
                    isReservation: { type: 'boolean' },
                    isParking: { type: 'boolean' },
                    isPet: { type: 'boolean' },
                    reason: { type: 'string' },
                  },
                  required: [
                    'title',
                    'genre',
                    'address',
                    'openTime',
                    'startDate',
                    'endDate',
                    'detailedAddress',
                    'isFee',
                    'isReservation',
                    'isParking',
                    'isPet',
                  ],
                  additionalProperties: false,
                },
              },
            },
          });

          const result = JSON.parse(
            completion.choices[0].message.content || '',
          );

          return result;
        } catch (err) {
          throw err;
        }
      },
      {
        retry: 3,
        delay: 500,
      },
    );
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
