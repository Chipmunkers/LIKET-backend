import { Injectable, Logger } from '@nestjs/common';
import { LocationEntity } from 'apps/batch-server/src/content-cron/culture-content/entity/location.entity';
import { TempContentEntity } from 'apps/batch-server/src/content-cron/culture-content/entity/temp-content.entity';
import { FestivalEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival.entity';
import { IExternalApiAdapterService } from 'apps/batch-server/src/content-cron/interface/external-api-adapter.service';
import { KakaoAddressEntity } from 'apps/batch-server/src/kakao-address/entity/address.entity';
import { KakaoRoadAddressEntity } from 'apps/batch-server/src/kakao-address/entity/road-address.entity';
import { KakaoAddressService } from 'apps/batch-server/src/kakao-address/kakao-address.service';
import { GENRE } from 'libs/common';
import { OpenAIService, S3Service } from 'libs/modules';

@Injectable()
export class TourApiAdapter
  implements IExternalApiAdapterService<FestivalEntity>
{
  constructor(
    private readonly logger: Logger,
    private readonly s3Service: S3Service,
    private readonly kakaoAddressService: KakaoAddressService,
    private readonly openAIService: OpenAIService,
  ) {}

  /**
   * @author jochongs
   */
  public async transform(data: FestivalEntity): Promise<TempContentEntity> {
    const {
      documents: [{ address, road_address: roadAddress }],
    } = await this.kakaoAddressService.searchAddress(data.addr1);

    throw new Error('hi');

    //return await this.createTempContentEntity(data, address, roadAddress);
  }

  /**
   * @author jochongs
   */
  private async createTempContentEntity(
    data: FestivalEntity,
    address: KakaoAddressEntity,
    roadAddress: KakaoRoadAddressEntity,
    uploadedS3ImgPathList: string[],
    styleIdxList: number[],
    ageIdx: number,
  ): Promise<TempContentEntity> {
    return TempContentEntity.create({
      id: data.contentId,
      location: await this.extractLocation(address, roadAddress, data.addr2),
      genreIdx: GENRE.FESTIVAL,
      ageIdx: ageIdx,
      styleIdxList: styleIdxList,
      title: await this.extractTitle(data),
      imgList: uploadedS3ImgPathList,
      description: await this.extractDescription(data),
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
    detailAddress: string | null,
  ): Promise<LocationEntity> {
    return LocationEntity.create({
      address: address.address_name,
      detailAddress: detailAddress,
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
  public async extractTitle(data: FestivalEntity): Promise<string> {
    return data.title;
  }

  /**
   * @author jochongs
   */
  public async extractDescription(
    data: FestivalEntity,
  ): Promise<string | null> {
    if (!data.info.introduce && !data.info.description) {
      return null;
    }

    return `${data.info.introduce ?? ''}${data.info.introduce ? '\n\n' : ''}${
      data.info.description ?? ''
    }`;
  }

  /**
   * @author jochongs
   */
  public async extractWebsiteLink(
    data: FestivalEntity,
  ): Promise<string | null> {
    return data.intro.eventHomepage;
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
