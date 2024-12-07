import { Injectable, Logger } from '@nestjs/common';
import { RawTempContentEntity } from './entity/raw-temp-content.entity';
import { TempContentEntity } from './entity/temp-content.entity';
import { TempContentLocationEntity } from './entity/temp-content-location.entity';
import { UploadedFileEntity } from 'libs/modules';
import { S3Service } from 'libs/modules';
import * as uuid from 'uuid';

@Injectable()
export class TempContentPipeService {
  constructor(
    private readonly logger: Logger,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * RawTempContent를 통해 TempContentEntity를 만드는 메서드
   *
   * @author jochongs
   */
  public async createTempContentEntity(
    rawEntity: RawTempContentEntity,
  ): Promise<TempContentEntity> {
    return TempContentEntity.create({
      id: await this.extractPerformId(rawEntity),
      location: await this.extractLocation(rawEntity),
      genreIdx: await this.extractGenreIdx(rawEntity),
      ageIdx: await this.extractAgeIdx(rawEntity),
      title: await this.extractTitle(rawEntity),
      imgList: (await this.extractImgList(rawEntity)).map((img) => img.path),
      description: await this.extractDescription(rawEntity),
      websiteLink: await this.extractWebsiteLink(rawEntity),
      startDate: await this.extractStartDate(rawEntity),
      endDate: await this.extractEndDate(rawEntity),
      openTime: await this.extractOpenTime(rawEntity),
      isFee: await this.extractIsFee(rawEntity),
      isReservation: await this.extractIsReservation(rawEntity),
      isPet: await this.extractIsPet(rawEntity),
      isParking: await this.extractIsParking(rawEntity),
    });
  }

  /**
   * @author jochongs
   */
  private async extractPerformId(
    rawEntity: RawTempContentEntity,
  ): Promise<string> {
    return rawEntity.perform.mt20id;
  }

  /**
   * @author jochongs
   */
  private async extractLocation(
    rawEntity: RawTempContentEntity,
  ): Promise<TempContentLocationEntity> {
    return TempContentLocationEntity.create({
      address: rawEntity.address.address_name,
      detailAddress: rawEntity.roadAddress.building_name,
      region1Depth: rawEntity.address.region_1depth_name,
      region2Depth: rawEntity.address.region_2depth_name,
      hCode: rawEntity.address.h_code,
      bCode: rawEntity.address.b_code,
      positionX: Number(rawEntity.address.x),
      positionY: Number(rawEntity.address.y),
    });
  }

  /**
   * @author jochongs
   */
  private async extractGenreIdx(
    rawEntity: RawTempContentEntity,
  ): Promise<number> {
    const genreName = rawEntity.perform.genrenm;
    if (genreName === '연극') {
      return 3; // 연극
    }

    if (genreName === '무용(서양/한국무용)') {
      return 5; // 콘서트
    }

    if (genreName === '대중무용') {
      return 5; // 콘서트
    }

    if (genreName === '서양음악(클래식)') {
      return 5; // 콘서트
    }

    if (genreName === '한국음악(국악)') {
      return 5; // 콘서트
    }

    if (genreName === '대중음악') {
      return 5; // 콘서트
    }

    if (genreName === '복합') {
      return 5; // 콘서트
    }

    if (genreName === '서커스/마술') {
      return 5; // 콘서트
    }

    if (genreName === '뮤지컬') {
      return 4;
    }

    this.logger.warn(`genre does not match | ${genreName}`, 'extractGenre');
    return 5;
  }

  /**
   * @author jochongs
   */
  private async extractAgeIdx(
    rawEntity: RawTempContentEntity,
  ): Promise<number | null> {
    return null;
  }

  /**
   * @author jochongs
   */
  private async extractTitle(rawEntity: RawTempContentEntity): Promise<string> {
    return rawEntity.perform.prfnm;
  }

  /**
   * @author jochongs
   */
  private async extractImgList(
    rawEntity: RawTempContentEntity,
  ): Promise<UploadedFileEntity[]> {
    return Promise.all(
      (await this.extractRawImgList(rawEntity)).map((rawImgUrl) =>
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
  private async extractRawImgList(
    rawEntity: RawTempContentEntity,
  ): Promise<string[]> {
    const imgPath: string[] = [];

    if (rawEntity.perform.poster) {
      imgPath.push(rawEntity.perform.poster);
    } else {
      this.logger.warn(
        'There is a case where a poster is not present',
        'extractImgList',
      );
    }

    const styurls = rawEntity.perform.styurls.styurl;

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
    rawEntity: RawTempContentEntity,
  ): Promise<string | null> {
    return rawEntity.perform.sty;
  }

  /**
   * @author jochongs
   */
  private async extractWebsiteLink(
    rawEntity: RawTempContentEntity,
  ): Promise<string> {
    const relates = rawEntity.perform.relates.relate;

    if (Array.isArray(relates)) {
      const relate = rawEntity.perform.relates.relate[0];

      return relate.relateurl;
    }

    return relates.relateurl;
  }

  /**
   * @author jochongs
   */
  private async extractStartDate(
    rawEntity: RawTempContentEntity,
  ): Promise<Date> {
    return this.transformKSTtoUTC(rawEntity.perform.prfpdfrom);
  }

  /**
   * @author jochongs
   */
  private async extractEndDate(
    rawEntity: RawTempContentEntity,
  ): Promise<Date | null> {
    if (
      rawEntity.perform.openrun === 'N' ||
      rawEntity.perform.prfpdto === ' '
    ) {
      return null;
    }

    const utcDate = this.transformKSTtoUTC(rawEntity.perform.prfpdto);

    utcDate.setHours(utcDate.getHours() + 24);
    utcDate.setSeconds(utcDate.getSeconds() - 1);
    return utcDate;
  }

  /**
   * @author jochongs
   */
  private async extractOpenTime(
    rawEntity: RawTempContentEntity,
  ): Promise<string> {
    return rawEntity.perform.dtguidance;
  }

  /**
   * @author jochongs
   */
  private async extractIsFee(
    rawEntity: RawTempContentEntity,
  ): Promise<boolean> {
    return !!rawEntity.perform.pcseguidance;
  }

  /**
   * @author jochongs
   */
  private async extractIsReservation(
    rawEntity: RawTempContentEntity,
  ): Promise<boolean> {
    return true;
  }

  /**
   * @author jochongs
   */
  private async extractIsPet(
    rawEntity: RawTempContentEntity,
  ): Promise<boolean> {
    return false;
  }

  /**
   * @author jochongs
   */
  private async extractIsParking(
    rawEntity: RawTempContentEntity,
  ): Promise<boolean> {
    return rawEntity.facility.parkinglot === 'Y';
  }

  /**
   * @author jochongs
   *
   * @param kstDate 2025.10.12
   */
  private transformKSTtoUTC(kstDate: string): Date {
    const date = new Date(kstDate.replace('.', '-'));

    date.setHours(date.getHours() + date.getTimezoneOffset());

    return date;
  }
}
