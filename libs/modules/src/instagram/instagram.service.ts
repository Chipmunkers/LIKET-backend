import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IgApiClient } from 'instagram-private-api';

@Injectable()
export class InstagramService {
  private readonly INSTAGRAM_USERNAME: string;
  private readonly INSTAGRAM_PASSWORD: string;
  private readonly igClient: IgApiClient;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.INSTAGRAM_USERNAME = this.configService.get('instagram').username;
    this.INSTAGRAM_PASSWORD = this.configService.get('instagram').password;
    this.igClient = new IgApiClient();
    this.igClient.state.generateDevice(this.INSTAGRAM_USERNAME);
  }

  public async getInstagramFeedData(feedCode: string) {
    // 1. 로그인
    await this.igClient.account.login(
      this.INSTAGRAM_USERNAME,
      this.INSTAGRAM_PASSWORD,
    );

    // 2. media 정보 조회
    const { urlSegmentToInstagramId } = require('instagram-id-to-url-segment');
    const media = await this.igClient.media.info(
      urlSegmentToInstagramId(feedCode),
    );
    const item = media.items[0];

    return {
      caption: item.caption?.text ?? '',
      images: this.extractImageUrls(item),
    };
  }

  private extractImageUrls(item: any): string[] {
    if (item.carousel_media) {
      // 여러 장 이미지
      return item.carousel_media.map(
        (media) => media.image_versions2.candidates[0].url,
      );
    } else {
      // 단일 이미지
      return [item.image_versions2?.candidates?.[0]?.url].filter(Boolean);
    }
  }
}
