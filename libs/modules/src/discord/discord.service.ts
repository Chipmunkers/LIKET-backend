import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { ServerType } from 'libs/common/constants/server-type';
import { inspect } from 'util';

@Injectable()
export class DiscordService {
  private readonly ERROR_WEBHOOK_URL: string;
  private readonly CONTENTS_WEBHOOK_URL: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ERROR_WEBHOOK_URL = this.configService.get('discord').errorWebhookUrl;
    this.CONTENTS_WEBHOOK_URL =
      this.configService.get('discord').contentsWebhookUrl;
  }

  /**
   * 디스코드에 에러 로그를 남기는 메서드
   *
   * @author jochongs
   */
  public async createErrorLog(
    context: ServerType,
    title: string,
    message: string,
    error?: any,
  ): Promise<void> {
    await this.httpService.axiosRef.post(
      this.ERROR_WEBHOOK_URL,
      {
        content: `# **🚨 에러 로그 알림**`,
        embeds: [
          {
            title,
            description: `${message}

Error Object
\`\`\`
${this.getErrorStr(error)}
\`\`\`
              `, // Description 추가
            color: 16711680, // 빨간색 (16진수)
            author: {
              name: context,
            },
            footer: {
              text: `시간: ${new Date().toLocaleString()}`,
            },
            timestamp: new Date().toISOString(),
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  /**
   * 디스코드에 컨텐츠 cron job 결과를 남기는 메서드
   *
   * @author jochongs
   */
  public async createContentsLog(message: string): Promise<void> {
    await this.httpService.axiosRef.post(
      this.CONTENTS_WEBHOOK_URL,
      {
        content: `# ** 💡 컨텐츠 수집 결과 **`,
        embeds: [
          {
            description: message,
            color: 48895, // 빨간색 (16진수)
            footer: {
              text: `시간: ${new Date().toLocaleString()}`,
            },
            timestamp: new Date().toISOString(),
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  /**
   * 에러를 파싱하는 메서드
   *
   * @author jochongs
   */
  private getErrorStr(err: any): string {
    if (typeof err === 'string') {
      return err;
    }

    if (typeof err === 'number') {
      return err.toString();
    }

    if (err === null || err === undefined) {
      return '';
    }

    if (err instanceof AxiosError) {
      return inspect(err.response?.data);
    }

    return inspect(err, { depth: null });
  }
}
