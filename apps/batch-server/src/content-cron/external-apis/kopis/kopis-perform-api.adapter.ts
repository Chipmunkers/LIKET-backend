import { Injectable, Logger } from '@nestjs/common';
import { LocationEntity } from 'apps/batch-server/src/content-cron/culture-content/entity/location.entity';
import { TempContentEntity } from 'apps/batch-server/src/content-cron/culture-content/entity/temp-content.entity';
import { FacilityEntity } from 'apps/batch-server/src/content-cron/external-apis/kopis/entity/facility.entity';
import { PerformEntity } from 'apps/batch-server/src/content-cron/external-apis/kopis/entity/perform.entity';
import { KopisFacilityProvider } from 'apps/batch-server/src/content-cron/external-apis/kopis/provider/kopis.facility.provider';
import { IExternalApiAdapterService } from 'apps/batch-server/src/content-cron/interface/external-api-adapter.service';
import { KakaoAddressEntity } from 'libs/modules/kakao-address/entity/kakao-address.entity';
import { KakaoRoadAddressEntity } from 'libs/modules/kakao-address/entity/kakao-road-address.entity';
import { KakaoAddressService } from 'libs/modules/kakao-address/kakao-address.service';
import { AGE, GENRE } from 'libs/common';
import { OpenAIService, S3Service, UploadedFileEntity } from 'libs/modules';
import * as uuid from 'uuid';
import { UpdateContentInfo } from 'apps/batch-server/src/content-cron/external-apis/kopis/type/UpdateContentInfo';

@Injectable()
export class KopisPerformApiAdapter
  implements IExternalApiAdapterService<PerformEntity>
{
  constructor(
    private readonly logger: Logger,
    private readonly s3Service: S3Service,
    private readonly kakaoAddressService: KakaoAddressService,
    private readonly facilityProvider: KopisFacilityProvider,
    private readonly openAIService: OpenAIService,
  ) {}

  /**
   * @author jochongs
   */
  public async transform(perform: PerformEntity): Promise<TempContentEntity> {
    const facilityEntity = await this.facilityProvider.getFacilityByPerform(
      perform,
    );

    const {
      documents: [{ address, road_address }],
    } = await this.kakaoAddressService.searchAddress(facilityEntity.adres);

    const imgPathList = (await this.extractImgList(perform)).map(
      (img) => img.path,
    );

    const { styleIdxList, ageIdx } =
      await this.openAIService.extractStyleAndAge(
        {
          perform,
          facilityEntity,
          address,
          road_address,
        },
        imgPathList.map(
          (imgPath) =>
            `https://${this.s3Service.getBucketName()}.s3.ap-northeast-2.amazonaws.com${imgPath}`,
        ),
      );

    return await this.createTempContentEntity(
      perform,
      facilityEntity,
      address,
      road_address,
      ageIdx,
      styleIdxList,
      imgPathList,
    );
  }

  /**
   * @author jochongs
   */
  public async extractUpdateData(
    data: PerformEntity,
  ): Promise<UpdateContentInfo> {
    const facilityEntity = await this.facilityProvider.getFacilityByPerform(
      data,
    );

    const {
      documents: [{ address, road_address }],
    } = await this.kakaoAddressService.searchAddress(facilityEntity.adres);

    return {
      description: await this.extractDescription(data),
      endDate: await this.extractEndDate(data),
      openTime: await this.extractOpenTime(data),
      startDate: await this.extractStartDate(data),
      location: await this.extractLocation(address, road_address),
    };
  }

  /**
   * KOPIS API로부터 제공받은 데이터를 통해 TempContentEntity를 만드는 메서드
   *
   * @author jochongs
   */
  public async createTempContentEntity(
    perform: PerformEntity,
    facility: FacilityEntity,
    address: KakaoAddressEntity,
    roadAddress: KakaoRoadAddressEntity,
    ageIdx: number,
    styleIdxList: number[],
    uploadedS3ImgPathList: string[],
  ): Promise<TempContentEntity> {
    return TempContentEntity.create({
      id: perform.mt20id,
      location: await this.extractLocation(address, roadAddress),
      genreIdx: await this.extractGenreIdx(perform),
      ageIdx: ageIdx,
      styleIdxList: styleIdxList,
      title: await this.extractTitle(perform),
      imgList: uploadedS3ImgPathList,
      description: await this.extractDescription(perform), // TODO: AI 필요
      websiteLink: await this.extractWebsiteLink(perform),
      startDate: await this.extractStartDate(perform),
      endDate: await this.extractEndDate(perform),
      openTime: await this.extractOpenTime(perform),
      isFee: await this.extractIsFee(perform),
      isReservation: await this.extractIsReservation(perform),
      isPet: await this.extractIsPet(perform),
      isParking: await this.extractIsParking(facility),
    });
  }

  /**
   * @author jochongs
   */
  private async extractLocation(
    address: KakaoAddressEntity,
    roadAddress: KakaoRoadAddressEntity,
  ): Promise<LocationEntity> {
    return LocationEntity.create({
      address: address.address_name,
      detailAddress: roadAddress.building_name ?? null,
      region1Depth: address.region_1depth_name,
      region2Depth: address.region_2depth_name,
      hCode: address.h_code,
      bCode: address.b_code,
      positionX: Number(address.x),
      positionY: Number(address.y),
    });
  }

  /**
   * @author jochongs
   */
  private async extractGenreIdx(perform: PerformEntity): Promise<number> {
    const genreName = perform.genrenm;
    if (genreName === '연극') {
      return GENRE.THEATER;
    }

    if (genreName === '무용(서양/한국무용)') {
      return GENRE.CONCERT;
    }

    if (genreName === '대중무용') {
      return GENRE.CONCERT;
    }

    if (genreName === '무용') {
      return GENRE.CONCERT;
    }

    if (genreName === '서양음악(클래식)') {
      return GENRE.CONCERT;
    }

    if (genreName === '한국음악(국악)') {
      return GENRE.CONCERT;
    }

    if (genreName === '대중음악') {
      return GENRE.CONCERT;
    }

    if (genreName === '복합') {
      return GENRE.CONCERT;
    }

    if (genreName === '서커스/마술') {
      return GENRE.CONCERT;
    }

    if (genreName === '뮤지컬') {
      return GENRE.MUSICAL;
    }

    this.logger.warn(`genre does not match | ${genreName}`, 'kopis-cron');
    return GENRE.CONCERT;
  }

  /**
   * @author jochongs
   */
  private async extractTitle(perform: PerformEntity): Promise<string> {
    return perform.prfnm;
  }

  /**
   * @author jochongs
   */
  private async extractImgList(
    perform: PerformEntity,
  ): Promise<UploadedFileEntity[]> {
    return Promise.all(
      (await this.extractRawImgList(perform)).map((rawImgUrl) =>
        this.s3Service.uploadFileToS3ByUrl(rawImgUrl, {
          filename: uuid.v4(),
          path: 'culture-content',
        }),
      ),
    );
  }

  /**
   * 가공되지 않은 이미지 full url을 추출하는 메서드
   *
   * @author jochongs
   */
  private async extractRawImgList(perform: PerformEntity): Promise<string[]> {
    const imgPath: string[] = [];

    if (perform.poster) {
      imgPath.push(perform.poster);
    } else {
      this.logger.warn(
        'There is a case where a poster is not present',
        'kopis-cron',
      );
    }

    const styurls = perform.styurls.styurl;

    if (Array.isArray(styurls)) {
      imgPath.push(...styurls);
    } else {
      imgPath.push(styurls);
    }

    return imgPath;
  }

  /**
   * @author jochongs
   */
  private async extractDescription(
    perform: PerformEntity,
  ): Promise<string | null> {
    return perform.sty;
  }

  /**
   * @author jochongs
   */
  private async extractWebsiteLink(perform: PerformEntity): Promise<string> {
    const relates = perform.relates.relate;

    if (Array.isArray(relates)) {
      const relate = perform.relates.relate[0];

      return relate.relateurl;
    }

    return relates.relateurl;
  }

  /**
   * @author jochongs
   */
  private async extractStartDate(perform: PerformEntity): Promise<Date> {
    return this.transformKSTtoUTC(perform.prfpdfrom);
  }

  /**
   * @author jochongs
   */
  private async extractEndDate(perform: PerformEntity): Promise<Date | null> {
    if (perform.prfpdto === ' ') {
      return null;
    }

    const utcDate = this.transformKSTtoUTC(perform.prfpdto);

    utcDate.setHours(utcDate.getHours() + 24);
    utcDate.setSeconds(utcDate.getSeconds() - 1);
    return utcDate;
  }

  /**
   * @author jochongs
   */
  private async extractOpenTime(perform: PerformEntity): Promise<string> {
    return perform.dtguidance;
  }

  /**
   * @author jochongs
   */
  private async extractIsFee(perform: PerformEntity): Promise<boolean> {
    return !!perform.pcseguidance;
  }

  /**
   * @author jochongs
   */
  private async extractIsReservation(perform: PerformEntity): Promise<boolean> {
    return true;
  }

  /**
   * @author jochongs
   */
  private async extractIsPet(perform: PerformEntity): Promise<boolean> {
    return false;
  }

  /**
   * @author jochongs
   */
  private async extractIsParking(facility: FacilityEntity): Promise<boolean> {
    return facility.parkinglot === 'Y';
  }

  /**
   * @author jochongs
   *
   * @param kstDate 2025.10.12
   */
  private transformKSTtoUTC(kstDate: string): Date {
    const [year, month, day] = kstDate.split('.').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());

    return utcDate;
  }
}
