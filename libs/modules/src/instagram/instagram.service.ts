import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IgApiClient,
  IgCookieNotFoundError,
  IgLoginRequiredError,
} from 'instagram-private-api';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { urlSegmentToInstagramId } from 'instagram-id-to-url-segment';
import { MediaNotFoundException } from 'libs/modules/instagram/exception/MediaNotFoundException';
import { InstagramFeedEntity } from 'libs/modules/instagram/entity/instagram-feed.entity';

@Injectable()
export class InstagramService {
  private readonly INSTAGRAM_USERNAME: string;
  private readonly INSTAGRAM_PASSWORD: string;
  private readonly igClient: IgApiClient;
  private readonly SESSION_FILE_PATH = 'ig-session.json';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.INSTAGRAM_USERNAME = this.configService.get('instagram').username;
    this.INSTAGRAM_PASSWORD = this.configService.get('instagram').password;
    this.igClient = new IgApiClient();

    // TODO: 세션을 새로 발급하거나 만들 때만 기기를 새로 생성하도록 수정
    this.igClient.state.generateDevice(this.INSTAGRAM_USERNAME);
  }

  /**
   * Instagram 로그인 초기화 메서드
   * ! 주의: 로그인이 되어있지 않다고 판단될 경우에만 시도
   *
   * @author jochongs
   */
  private async initAuth(): Promise<void> {
    const sessionString = await this.getSessionStringFromFile();

    if (sessionString) {
      try {
        await this.igClient.state.deserialize(sessionString);
        await this.igClient.account.currentUser(); // 세션 확인
        return;
      } catch (err) {
        console.log('Session invalid, re-logging in');
      }
    }

    // 세션이 없거나 실패했을 때 로그인
    await this.login();
    await this.setSessionToFile();
  }

  /**
   * 세션 문자열을 파일로부터 읽어보는 메서드
   *
   * @author jochongs
   */
  private async getSessionStringFromFile(): Promise<string> {
    if (existsSync(this.SESSION_FILE_PATH)) {
      const sessionData = readFileSync(this.SESSION_FILE_PATH, 'utf8');
      return sessionData;
    } else {
      return '';
    }
  }

  /**
   * Instagram 로그인
   *
   * @author jochongs
   */
  private async login() {
    console.log('Instagram login');
    await this.igClient.account.login(
      this.INSTAGRAM_USERNAME,
      this.INSTAGRAM_PASSWORD,
    );
  }

  /**
   *  세션 정보를 파일로 저장하는 메서드
   *
   * @author jochongs
   */
  private async setSessionToFile() {
    console.log('session file save');
    const session = await this.igClient.state.serialize();
    writeFileSync(this.SESSION_FILE_PATH, JSON.stringify(session));
  }

  /**
   * Instagram 피드 데이터를 가져오는 메서드
   *
   * @author jochongs
   */
  public async getInstagramFeedData(
    feedCode: string,
  ): Promise<InstagramFeedEntity> {
    const mediaId = urlSegmentToInstagramId(feedCode);
    try {
      const media = await this.igClient.media.info(mediaId);
      const item = media.items[0];

      return InstagramFeedEntity.from({
        caption: item.caption?.text ?? '',
        images: this.extractImageUrls(item),
        createdAt: new Date(item.taken_at * 1000),
      });
    } catch (err) {
      if (err.message?.includes('Media not found or unavailable')) {
        throw new MediaNotFoundException(mediaId);
      }

      // 로그인 관련 에러가 아닌 경우 다시 throw
      if (
        !(
          err instanceof IgCookieNotFoundError ||
          err instanceof IgLoginRequiredError
        )
      ) {
        throw err;
      }
    }

    await this.initAuth();

    const media = await this.igClient.media.info(mediaId);
    const item = media.items[0];

    return InstagramFeedEntity.from({
      caption: item.caption?.text ?? '',
      images: this.extractImageUrls(item),
      createdAt: new Date(item.taken_at * 1000),
    });
  }

  private extractImageUrls(item: any): string[] {
    if (item.carousel_media) {
      return item.carousel_media.map(
        (media) => media.image_versions2.candidates[0].url,
      );
    } else {
      return [item.image_versions2?.candidates?.[0]?.url].filter(Boolean);
    }
  }
}
