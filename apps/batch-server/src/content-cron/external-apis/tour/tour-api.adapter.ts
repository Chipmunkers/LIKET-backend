import { Injectable, Logger } from '@nestjs/common';
import { LocationEntity } from 'apps/batch-server/src/content-cron/culture-content/entity/location.entity';
import { TempContentEntity } from 'apps/batch-server/src/content-cron/culture-content/entity/temp-content.entity';
import { FestivalEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival.entity';
import { IExternalApiAdapterService } from 'apps/batch-server/src/content-cron/interface/external-api-adapter.service';
import { KakaoAddressEntity } from 'apps/batch-server/src/kakao-address/entity/address.entity';
import { KakaoRoadAddressEntity } from 'apps/batch-server/src/kakao-address/entity/road-address.entity';
import { KakaoAddressService } from 'apps/batch-server/src/kakao-address/kakao-address.service';
import { GENRE } from 'libs/common';
import { OpenAIService, S3Service, UploadedFileEntity } from 'libs/modules';
import * as uuid from 'uuid';

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

    const imgUrlList = await this.extractImgList(data);

    const uploadedImgList = await this.uploadImg(imgUrlList);

    const { styleIdxList, ageIdx } =
      await this.openAIService.extractStyleAndAge(
        {
          data,
          address,
          roadAddress,
        },
        uploadedImgList.map(
          (file) =>
            `https://${this.s3Service.getBucketName()}.s3.ap-northeast-2.amazonaws.com${
              file.path
            }`,
        ),
      );

    return await this.createTempContentEntity(
      data,
      address,
      roadAddress,
      uploadedImgList.map((img) => img.path),
      styleIdxList,
      ageIdx,
    );
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
      websiteLink: await this.extractWebsiteLink(data),
      startDate: await this.extractStartDate(data),
      endDate: await this.extractEndDate(data),
      openTime: await this.extractOpenTime(data),
      isFee: await this.extractIsFee(data),
      isReservation: await this.extractIsReservation(data),
      isPet: false,
      isParking: false,
    });
  }

  /**
   * @author jochongs
   */
  private async uploadImg(imgUrlList: string[]): Promise<UploadedFileEntity[]> {
    return Promise.all(
      imgUrlList.map((url) =>
        this.s3Service.uploadFileToS3ByUrl(url, {
          filename: uuid.v4(),
          path: 'culture-content',
        }),
      ),
    );
  }

  /**
   * @author jochongs
   */
  private async extractImgList(data: FestivalEntity): Promise<string[]> {
    const imgUrlList: string[] = [];

    imgUrlList.push(data.posterOrigin);

    imgUrlList.push(...data.imgList.map((img) => img.origin));

    return imgUrlList;
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
  private async extractTitle(data: FestivalEntity): Promise<string> {
    return data.title;
  }

  /**
   * @author jochongs
   */
  private async extractDescription(
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
  private async extractIsFee(festival: FestivalEntity): Promise<boolean> {
    return festival.intro.useTimeFestival !== '무료';
  }

  /**
   * @author jochongs
   */
  private async extractIsReservation(
    festival: FestivalEntity,
  ): Promise<boolean> {
    return festival.intro.useTimeFestival !== '무료';
  }

  /**
   * @author jochongs
   */
  private async extractOpenTime(data: FestivalEntity): Promise<string | null> {
    return data.intro.playtime;
  }

  /**
   * @author jochongs
   */
  private async extractWebsiteLink(
    data: FestivalEntity,
  ): Promise<string | null> {
    return data.intro.eventHomepage;
  }

  /**
   * @author jochongs
   */
  private async extractStartDate(festival: FestivalEntity): Promise<Date> {
    return this.transformKSTtoUTC(
      this.transformDateStringToIso8601(festival.intro.eventStartDate),
    );
  }

  /**
   * @author jochongs
   */
  private async extractEndDate(festival: FestivalEntity): Promise<Date | null> {
    const endDate = festival.intro.eventEndDate;

    if (!endDate) return null;

    return this.transformKSTtoUTC(this.transformDateStringToIso8601(endDate));
  }

  /**
   * @author jochongs
   *
   * @param kstDate 2025-10-12
   */
  private transformKSTtoUTC(kstDate: string): Date {
    const utcDate = new Date(kstDate);
    utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());

    return utcDate;
  }

  /**
   * @author jochongs
   *
   * @param dateString 20240123
   */
  private transformDateStringToIso8601(
    dateStr: string,
  ): `${string}-${string}-${string}` {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const date = dateStr.substring(6, 8);

    return `${year}-${month}-${date}`;
  }
}
